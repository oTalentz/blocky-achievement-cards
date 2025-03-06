
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tiwbomxhbdrwhkzvtcoa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpd2JvbXhoYmRyd2hrenZ0Y29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODYwMzYsImV4cCI6MjA1Njg2MjAzNn0.h4W2Np7LF0RNbXJfeOUF9dNiCiCv-8hOb7lj1PBx2DI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
