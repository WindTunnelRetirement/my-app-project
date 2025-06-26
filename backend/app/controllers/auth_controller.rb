class AuthController < ApplicationController
  before_action :authorize_request, except: [:login, :register]
  
  # POST /auth/register
  def register
    @user = User.new(user_params)
    
    if @user.save
      token = JsonWebToken.encode(user_id: @user.id)
      render json: {
        token: token,
        user: {
          id: @user.id,
          name: @user.name,
          email: @user.email
        }
      }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # POST /auth/login
  def login
    @user = User.find_by(email: params[:email]&.downcase)
    
    if @user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: @user.id)
      render json: {
        token: token,
        user: {
          id: @user.id,
          name: @user.name,
          email: @user.email
        }
      }
    else
      render json: { error: 'メールアドレスまたはパスワードが間違っています。' }, status: :unauthorized
    end
  end
  
  # GET /auth/me
  def me
    render json: {
      user: {
        id: @current_user.id,
        name: @current_user.name,
        email: @current_user.email
      }
    }
  end
  
  # DELETE /auth/logout
  def logout
    # JWTトークンはステートレスなので、フロントエンド側でトークンを削除するだけ
    render json: { message: 'ログアウトしました。' }
  end
  
  private
  
  def user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end