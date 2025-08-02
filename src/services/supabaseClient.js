import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://gagvvguvoxnwjakifjyc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZ3Z2Z3V2b3hud2pha2lmanljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTc2NzYsImV4cCI6MjA2OTczMzY3Nn0.5BVBn0q3YBai0nOAk_FOR9-POcC7s-ch82jgeOSTIYY'

export const supabase = createClient(supabaseUrl, supabaseKey)