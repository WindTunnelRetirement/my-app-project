Rails.application.routes.draw do
  # ルートパスを追加
  root 'tasks#index'  # これを追加
  
  resources :tasks do
    member do
      patch :toggle
    end
  end
  
  get "up" => "rails/health#show", as: :rails_health_check
end