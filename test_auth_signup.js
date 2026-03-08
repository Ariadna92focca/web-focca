const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://htynwdgzxbfrqomgwijc.supabase.co';
const supabaseAnonKey = 'sb_publishable_5RRf6OUAVDdFzgJqrwTcBg_-GjwWn67';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function signupTestUser() {
    const { data, error } = await supabase.auth.signUp({
        email: 'testfocca@gmail.com',
        password: 'password123',
    });

    if (error) {
        console.error('Error signing up:', error.message);
    } else {
        console.log('User signed up successfully:', data.user.id);
    }
}

signupTestUser();
