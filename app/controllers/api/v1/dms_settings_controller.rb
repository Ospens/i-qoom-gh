class Api::V1::DmsSettingsController < ApplicationController
  load_resource :project, id_param: :project_id
  authorize_resource :dms_setting

  def edit
    render json: DmsSetting.attributes_for_edit(@project, signed_in_user)
  end

  def update
    if @project.update(dms_params)
      head 200
    else
      render json: @project.errors,
             status: :unprocessable_entity
    end
  end

  private

  def dms_params
    params[:project][:dms_settings_attributes] =
      params[:project].delete(:dms_settings)
    params.require(:project).permit(dms_settings_attributes: [:id, :name, :value]).tap do |i|
      i[:dms_settings_attributes].each{ |k| k.merge!(user_id: signed_in_user.id) }
    end
  end
end
