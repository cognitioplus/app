import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://viihxzbozphbngaqtspd.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNhYzFmNzU4LTgwZDktNGMxYS04MzkzLWI1ZWJhNjJkMTQyMiJ9.eyJwcm9qZWN0SWQiOiJ2aWloeHpib3pwaGJuZ2FxdHNwZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc3ODg0MDQxLCJleHAiOjIwOTMyNDQwNDEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.ZQsX-ruVpNDXvizLfO3e3uk1YF3uJ3kNdWEm-_INwLo';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };