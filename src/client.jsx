import { createClient } from '@supabase/supabase-js'
const URL = 'https://byexehunbujcboxbrscp.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZXhlaHVuYnVqY2JveGJyc2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzU5NDEsImV4cCI6MjA2MDk1MTk0MX0.oXvAIxTYL4rcIfY79PNuCSZYiEMlOytFgyMkMg90yq0';

export const supabase = createClient(URL, API_KEY);

