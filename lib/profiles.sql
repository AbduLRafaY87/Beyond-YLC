-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  ylc_batch text,
  interests text[],
  bio text,
  location text,
  website text,
  github text,
  linkedin text,
  twitter text,
  occupation text,
  organization text,
  skills text[],
  achievements text[],
  privacy text default 'public',
  notifications jsonb default '{"email": true, "push": true, "marketing": false}',
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  primary key (id)
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
create policy "Users can view all profiles"
  on profiles for select
  using (true);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
