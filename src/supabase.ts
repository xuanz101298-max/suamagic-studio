import { createClient } from '@supabase/supabase-js';

// 使用环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dxlocqoyqoehkvziunnp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_kbArZ2HbKpEqU-KcDn3Tpw_gPLf63Gy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
