class TasksController < ApplicationController
  before_action :set_task, only: [:update, :destroy, :toggle]  # show を削除

  def index
    @tasks = Task.all
    
    # フィルタリング
    @tasks = @tasks.by_priority(params[:priority]) if params[:priority].present?
    @tasks = @tasks.by_category(params[:category]) if params[:category].present?
    
    case params[:status]
    when 'completed'
      @tasks = @tasks.completed
    when 'pending'
      @tasks = @tasks.pending
    end
    
    # 並び替え (優先度順、作成日順)
    case params[:sort]
    when 'priority'
      @tasks = @tasks.order(:priority, :created_at)
    when 'created_at'
      @tasks = @tasks.order(:created_at)
    else
      @tasks = @tasks.order(:priority, :created_at) # デフォルトは優先度順
    end
    
    render json: @tasks
  end

  def create
    @task = Task.new(task_params)
    
    if @task.save
      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    head :no_content
  end

  def toggle
    @task.update(done: !@task.done)
    render json: @task
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :priority, :category, :done)
  end
end