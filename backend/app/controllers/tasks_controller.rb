class TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy, :toggle]

  # GET /tasks
  def index
    @tasks = Task.all.order(created_at: :desc)
    render json: @tasks
  end

  # GET /tasks/1
  def show
    render json: @task
  end

  # POST /tasks
  def create
    @task = Task.new(task_params)
    @task.done = false if @task.done.nil?

    if @task.save
      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tasks/1
  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: @task.errors, status: :unprocessable_entity
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

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :done)
  end
end