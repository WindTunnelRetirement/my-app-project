Rails.application.routes.draw do
  # ルートパスを追加
  root 'tasks#index'  # これを追加
  
  post '/auth/login', to: 'auth#login'
  post '/auth/register', to: 'auth#register'
  get '/auth/me', to: 'auth#me'
  delete '/auth/logout', to: 'auth#logout'

  resources :tasks do
    member do
      patch :toggle
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end