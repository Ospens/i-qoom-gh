class ProjectSerializer < ApplicationSerializer
  has_many :admins do
    object.admins.order(id: :asc)
  end
  has_one :company_data, serializer: CompanyDataSerializer

  def attributes(*args)
    object.attributes.symbolize_keys.tap do |keys|
      if !object.members.find_by(user: @instance_options[:user]).try(:dms_module_access?)
        keys.except!(:project_code)
      end
    end
  end
end
