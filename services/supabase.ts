import { createClient } from '@supabase/supabase-js';

// Hardcode the Supabase URL and anon key provided by the user
const supabaseUrl = 'https://lotxxmexulijiczbsmjz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvdHh4bWV4dWxpamljemJzbWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTY3MTAsImV4cCI6MjA3NjYzMjcxMH0.LLhS8biZ-fEpZJ0wAePucMSpB_sFE-fJFNMzJZZVL-M';

// Inisialisasi dan ekspor klien Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
