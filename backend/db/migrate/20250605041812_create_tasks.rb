class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.boolean :done, default: false
      t.integer :priority, default: 1
      t.string :category, default: 'general'
      t.references :user, null: false, foreign_key: true
      
      t.timestamps
    end
    
    add_index :tasks, [:user_id, :created_at]
  end
end