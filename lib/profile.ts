import { supabase } from './supabase'

export async function ensureProfile(user: any) {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!data) {
    await supabase.from('profiles').insert({
      id: user.id,
      name: user.email?.split('@')[0]
    })
  }
}
