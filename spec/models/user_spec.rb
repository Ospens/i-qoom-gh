require 'rails_helper'

describe User, type: :model do

  [:email,
   :first_name,
   :last_name,
   :username,
   :password].each do |value|
    it { is_expected.to validate_presence_of(value) }
  end

  it { is_expected.to validate_length_of(:first_name)
                        .is_at_least(2)
                        .is_at_most(255) }

  it { is_expected.to validate_length_of(:last_name)
                        .is_at_least(2)
                        .is_at_most(255) }

  it { is_expected.to have_many(:sent_messages)
                        .class_name("Message")
                        .with_foreign_key(:sender_id) }
  it { is_expected.to have_many(:received_messages)
                        .class_name("Message")
                        .with_foreign_key(:recipient_id) }
  it { is_expected.to validate_presence_of(:password_confirmation).on(:create) }
  it { is_expected.to validate_presence_of(:password_confirmation).on(:password_changed?) }
  it { is_expected.not_to validate_presence_of(:password_confirmation).on(:update) }

  it { is_expected.to validate_acceptance_of(:accept_terms_and_conditions) }
  it { is_expected.not_to allow_value(nil).for(:accept_terms_and_conditions) }

  it { is_expected.to validate_inclusion_of(:country)
                        .in_array(ISO3166::Country.codes) }

  it { is_expected.to allow_value(Faker::Internet.email).for(:email) }

  context "uniqueness of username" do
    subject { FactoryBot.create(:user) }
    it { is_expected.to validate_uniqueness_of(:username) }
  end

  it { is_expected.to validate_length_of(:username).is_at_most(18) }

  it { is_expected.to allow_value(Faker::Internet.unique.user_name[0..17])
                        .for(:username) }
  it { is_expected.not_to allow_value(Faker::Name.name)
                        .for(:username) }

  it "sends confirmation email" do
    user = FactoryBot.create(:user, confirmed_at: nil)
    expect(user.confirmation_sent_at).to be_present
  end
end
