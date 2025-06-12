Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  resources :tasks do
    member do
      patch :toggle
    end
  end
  
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API のルートパス - 簡単なレスポンスを返す
  root to: proc { [200, { 'Content-Type' => 'application/json' }, ['{"message": "Task API is running", "version": "1.0"}'].to_json] }
  
  # または、tasksコントローラーのindexをルートにする場合
  # root "tasks#index"
end