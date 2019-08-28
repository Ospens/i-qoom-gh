require 'rails_helper'

RSpec.describe ProjectAdministrator, type: :model do
  it { is_expected.to belong_to(:project).inverse_of(:admins) }
  it { is_expected.not_to validate_presence_of(:user) }
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to allow_value(Faker::Internet.email).for(:email) }
  it { is_expected.to validate_uniqueness_of(:email)
                          .scoped_to(:project_id) }
  it { is_expected.to belong_to(:user).required(false) }
  it { is_expected.to belong_to(:inviter)
                        .class_name("User")
                        .required(false) }

  context "add_user" do
    it 'should be added when created' do
      user = FactoryBot.create(:user)
      project =
        FactoryBot.create(:project,
          admins: [FactoryBot.build(:project_administrator,
                                     email: user.email)] )
      expect(project.admins.first.user).to eq(user)
    end
    it "shouldn't be added if there is no such user" do
      project = FactoryBot.create(:project)
      expect(project.admins.first.user).to eq(nil)
    end
    it "shouldn't be replaced after updating" do
      user = FactoryBot.create(:user)
      project =
        FactoryBot.create(:project,
          admins: [FactoryBot.build(:project_administrator,
                                     email: user.email)] )
      second_user = FactoryBot.create(:user)
      project.admins.first.update(email: second_user.email)
      expect(project.admins.first.user).not_to eq(second_user)
    end
  end

  it "send_confirmation_email" do
    project_admin = FactoryBot.create(:project).admins.first
    project_admin.reload
    expect(project_admin.inviter_id).to be_present
    expect(project_admin.first_confirmation_sent_at).to be_present
    expect(project_admin.confirmation_resent_at).to be_nil
    expect(project_admin.status).to eq("awaiting_confirmation")

    project_admin.send_confirmation_email
    expect(project_admin.confirmation_resent_at).to be_present
    expect(project_admin.status).to eq("awaiting_confirmation")
  end

  context "remove admin" do
    let(:project) { FactoryBot.create(:project) }
    it "admin should be removed" do
      project.admins << FactoryBot.build(:project_administrator)
      project.save
      project.admins.first.remove
      expect(project.admins.count).to eq(2)
    end
    it "admin shouldn't be removed if he is the last one" do
      project.admins.first.remove
      expect(project.admins.count).to eq(1)
    end
  end
end