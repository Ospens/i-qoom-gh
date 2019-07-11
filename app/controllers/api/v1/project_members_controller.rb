class Api::V1::ProjectMembersController < ApplicationController
  load_and_authorize_resource :project
  load_and_authorize_resource :project_member,
                              through: :project,
                              through_association: :members

  def index
    render json: @project.members,
                 each_serializer: ProjectMemberSerializer,
           status: :ok
  end

  def new
    render json: { company_types:
                     enum_keys_with_titles(ProjectMember.company_types),
                   employment_types:
                     enum_keys_with_titles(ProjectMember.employment_types) },
           status: :ok
  end

  def create
    if @project_member.save
      render json: { status: "success",
                     message: t(".success_message"),
                     project_member: ActiveModel::Serializer::CollectionSerializer.new([@project_member],
                                         serializer: ProjectMemberSerializer) },
             status: :created
    else
      error(@project_member)
    end
  end

  def update   
    if @project_member.update(project_member_params)
      render json: { status: "success",
                     message: t(".success_message"),
                     project_member: ActiveModel::Serializer::CollectionSerializer.new([@project_member],
                                         serializer: ProjectMemberSerializer) },
             status: :created
    else
      error(@project_member)
    end
  end

  private

  def project_member_params
    params.fetch(:project_member,
                 { }).permit(:creation_step,
                             :employment_type,
                             :company_type,
                             :email,
                             :first_name,
                             :last_name,
                             :phone_code,
                             :phone_number,
                             company_address_attributes: Address.column_names)
  end

end