class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    # テーブルが存在しない場合のみ作成
    unless table_exists?(:users)
      create_table :users do |t|
        t.string :name, null: false
        t.string :email, null: false
        t.string :password_digest, null: false
        
        t.timestamps
      end
    end
    
    # インデックスが存在しない場合のみ追加
    unless index_exists?(:users, :email)
      add_index :users, :email, unique: true
    end
  end
end