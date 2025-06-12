# backend/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境
    origins ENV['FRONTEND_URL'] || 'http://localhost:5173'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end
  
  # 本番環境用（Vercelドメイン）
  allow do
    origins /https:\/\/.*\.vercel\.app$/
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end
  
  # 追加：特定のドメインを明示的に許可
  allow do
    origins ENV['FRONTEND_URL']
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end if ENV['FRONTEND_URL']
end