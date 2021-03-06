FactoryBot.define do
  factory :document_field do
    parent { create(:project).conventions.active }
    kind { :text_field } # do not change
    column { 1 }
    value { '1' }

    after(:build) do |instance|
      instance.document_field_values.new(attributes_for(:document_field_value))
    end
  end
end
