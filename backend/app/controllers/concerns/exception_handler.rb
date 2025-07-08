module ExceptionHandler
  extend ActiveSupport::Concern
  
  class AuthenticationError < StandardError; end
  class MissingToken < StandardError; end
  class InvalidToken < StandardError; end
  
  included do
    rescue_from ExceptionHandler::AuthenticationError, with: :unauthorized_request
    rescue_from ExceptionHandler::MissingToken, with: :unauthorized_request
    rescue_from ExceptionHandler::InvalidToken, with: :unauthorized_request
    rescue_from ExceptionHandler::MissingToken, with: :four_two_two
    rescue_from ExceptionHandler::InvalidToken, with: :four_two_two
    rescue_from ActiveRecord::RecordInvalid, with: :four_two_two

    rescue_from ActiveRecord::RecordNotFound do |e|
      render json: { error: e.message }, status: :not_found
    end
  end
  
  private

  def four_two_two(e)
    render json: { error: e.message }, status: :unprocessable_entity
  end
  
  def unauthorized_request(e)
    render json: { error: e.message }, status: :unauthorized
  end
end