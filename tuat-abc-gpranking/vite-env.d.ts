/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_API_KEY: string;
    readonly VITE_SUPABASE_URL: string;
    // 他の環境変数があればここに追加
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }