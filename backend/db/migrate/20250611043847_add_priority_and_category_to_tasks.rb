class AddPriorityAndCategoryToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :priority, :integer, default: 1
    add_column :tasks, :category, :string, default: 'general'
    
    add_index :tasks, :priority
    add_index :tasks, :category
  end
end
