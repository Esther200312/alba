import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://losigimuekyrtfimprws.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvc2lnaW11ZWt5cnRmaW1wcndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NDUzNzQsImV4cCI6MjEwMjIyMTM3NH0.5hTC7gKgNWHnAmVF3TnyaLxiXBm5GUhYeMJhqCTqyJ8";

export const supabase = createClient(supabaseUrl, supabaseKey);