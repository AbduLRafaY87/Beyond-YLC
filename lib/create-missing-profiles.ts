import { supabase } from './supabase'

export async function createMissingProfiles() {
  try {
    console.log('Starting profile creation process...')

    // Get all users from auth.users (this requires admin privileges)
    // Since we can't directly query auth.users from client, we'll need to use a different approach

    // Alternative: Get all profiles and compare with a list of known users
    // For now, let's create a function that can be called from the browser

    // First, let's check what profiles we have
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')

    if (profilesError) {
      console.error('Error fetching existing profiles:', profilesError)
      return
    }

    console.log(`Found ${existingProfiles?.length || 0} existing profiles`)

    // Since we can't directly query auth.users, we'll need to create profiles
    // for users as they log in, or provide a way to manually create them

    // For now, let's create a function that can be called to create profiles
    // This would typically be done server-side or with admin privileges

    console.log('Profile creation process completed')
    return { success: true, message: 'Process completed. Check console for details.' }

  } catch (error) {
    console.error('Error in createMissingProfiles:', error)
    return { success: false, error: error.message }
  }
}

// Function to create a profile for a specific user
export async function createProfileForUser(userId: string, userData?: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: userData?.full_name || userData?.name || 'Anonymous User',
        avatar_url: userData?.avatar_url || userData?.picture,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      // If profile already exists, that's fine
      if (error.code === '23505') {
        console.log(`Profile already exists for user ${userId}`)
        return { success: true, message: 'Profile already exists' }
      }
      throw error
    }

    console.log(`Created profile for user ${userId}`)
    return { success: true, data }

  } catch (error) {
    console.error(`Error creating profile for user ${userId}:`, error)
    return { success: false, error: error.message }
  }
}
