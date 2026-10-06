import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pnylvbcvpnpkbiehdatv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_N1q81gh7-C4j2KLH5sKKxg_0X5JICPI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
