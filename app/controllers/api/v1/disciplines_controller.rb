class Api::V1::DisciplinesController < ApplicationController
  load_and_authorize_resource :project
  load_and_authorize_resource :discipline,
                              through: :project
  def index
    render json: @project.disciplines,
           status: :ok
  end

  def edit
    render json: @discipline,
           status: :ok
  end

  def create
    if @discipline.save
      render json: @discipline,
             status: :created
    else
      render json: @discipline.errors,
             status: :unprocessable_entity
    end
  end

  def update
    if @discipline.update(discipline_params)
      render json: @discipline,
             status: :ok
    else
      render json: @discipline.errors,
             status: :unprocessable_entity
    end
  end

  def destroy
    @discipline.destroy
    head :no_content
  end

  private

  def discipline_params
    params.fetch(:discipline, { }).permit(:title)
  end
end