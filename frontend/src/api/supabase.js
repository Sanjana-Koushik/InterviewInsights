import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzaqrgfrpttjhabucbed.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YXFyZ2ZycHR0amhhYnVjYmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NDQwMTEsImV4cCI6MjA5NjIyMDAxMX0.7KVjfsHFLIHgwwGNpAv4_LDmSZv3hU0UWZK2LDYR7xk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);