const SUPABASE_URL = "https://qjtjhrdqbzseuaninmpx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdGpocmRxYnpzZXVhbmlubXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NDI4OTgsImV4cCI6MjA5NzMxODg5OH0.5-IrGZczpXRQqvsKjJu6VFDtc_if-bjmEcWurXlFQPc";
const SUPABASE_BUCKET = "el-circulo-eventos";

window.SupabaseConfig = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,
  bucket: SUPABASE_BUCKET,
};