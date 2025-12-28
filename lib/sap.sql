-- Create sap table
create table sap (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  location text not null,
  target_members integer not null,
  start_date date not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable Row Level Security (RLS)
alter table sap enable row level security;

-- Create policies
create policy "Users can view all sap"
  on sap for select
  using (true);

create policy "Users can insert own sap"
  on sap for insert
  with check (auth.uid() = created_by);

create policy "Users can update own sap"
  on sap for update
  using (auth.uid() = created_by);

-- Create function to update updated_at timestamp
create or replace function update_sap_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_sap_updated_at
  before update on sap
  for each row
  execute function update_sap_updated_at();
