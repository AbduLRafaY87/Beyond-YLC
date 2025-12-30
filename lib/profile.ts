import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export async function ensureProfile(user: User) {
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
