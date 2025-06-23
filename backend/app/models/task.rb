class Task < ApplicationRecord
  # 関連付け
  belongs_to :user
  
  # バリデーション
  validates :title, presence: true
  validates :priority, inclusion: { in: [1, 2, 3] } # 1=高, 2=中, 3=低
  validates :category, presence: true
  validates :user_id, presence: true
  
  # スコープを定義してフィルタリングを簡単に
  scope :by_priority, ->(priority) { where(priority: priority) }
  scope :by_category, ->(category) { where(category: category) }
  scope :completed, -> { where(done: true) }
  scope :pending, -> { where(done: [false, nil]) }
  
  # 優先度の表示名
  def priority_name
    case priority
    when 1 then '高'
    when 2 then '中'
    when 3 then '低'
    else '中'
    end
  end
  
  # デフォルト値を設定
  after_initialize :set_defaults
  
  private
  
  def set_defaults
    self.priority ||= 2 # デフォルトは「中」
    self.category ||= 'general'
  end
end