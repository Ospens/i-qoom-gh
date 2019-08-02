class Role < ApplicationRecord
  has_many :project_members
  belongs_to :project

  validates :name,
            presence: true,
            uniqueness: { scope: [:project_id] },
            length: { minimum: 2,
                      maximum: 255 }
end
