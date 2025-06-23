class TasksController < ApplicationController
  before_action :authorize_request
  before_action :set_task, only: [:show, :update, :destroy, :toggle]
  
  # GET /tasks
  def index
    @tasks = @current_user.tasks.all
    render json: @tasks
  end
  
  # GET /tasks/1
  def show
    render json: @task
  end
  
  # POST /tasks
  def create
    @task = @current_user.tasks.build(task_params)
    
    if @task.save
      render json: @task, status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PATCH/PUT /tasks/1
  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /tasks/1
  def destroy
    @task.destroy
    head :no_content
  end
  
  # PATCH /tasks/1/toggle
  def toggle
    @task.update(done: !@task.done)
    render json: @task
  end
  
  private
  
  # 現在のユーザーのタスクのみを取得
  def set_task
    @task = @current_user.tasks.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'タスクが見つかりません。' }, status: :not_found
  end
  
  # Strong parameters
  def task_params
    params.require(:task).permit(:title, :done, :priority, :category)
  end
end