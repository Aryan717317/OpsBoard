
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

console.log('Testing connection to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);

        if (error) {
            console.error('Supabase Error:', error);
        } else {
            console.log('Supabase Connection Successful!');
            console.log('Data sample:', data);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

testConnection();
