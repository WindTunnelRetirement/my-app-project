class ApplicationController < ActionController::API
  include ExceptionHandler
  
  private
  
  # リクエストヘッダーからトークンを取得
  def http_token
    @http_token ||= if request.headers['Authorization'].present?
                      request.headers['Authorization'].split(' ').last
                    end
  end
  
  # トークンをデコードしてユーザーを取得
  def auth_token
    @auth_token ||= JsonWebToken.decode(http_token)
  end
  
  # 現在のユーザーを取得
  def current_user
    @current_user ||= User.find(auth_token[:user_id]) if auth_token
  end
  
  # リクエストを認証
  def authorize_request
    raise ExceptionHandler::MissingToken unless http_token
    raise ExceptionHandler::InvalidToken unless request_authorized?
    @current_user = current_user
  end
  
  def request_authorized?
    auth_token && current_user
  end
end