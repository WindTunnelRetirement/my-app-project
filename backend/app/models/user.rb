class User < ApplicationRecord
  has_secure_password
  
  # バリデーション
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  
  # 関連付け
  has_many :tasks, dependent: :destroy
  
  # メールアドレスを小文字で保存
  before_save :downcase_email
  
  private
  
  def downcase_email
    self.email = email.downcase
  end
end