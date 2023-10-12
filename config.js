export const config = {
  siteName: '4ft',
  locale: 'en-US',
  
  
  dev: {
    mode: 'production',
    use: 'node',
    database: 'supabase',
    backend: {
      local: 'http://0.0.0.0:3000/api',
      development: 'http://0.0.0.0:3000/api',
      production: 'https://4ft-api.vercel.app/api'
    }
  }
}