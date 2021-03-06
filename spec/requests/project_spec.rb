require 'rails_helper'

describe "Project", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project_name_step, user_id: user.id) }
  let(:second_project) { FactoryBot.create(:project, user_id: user.id) }
  let(:second_user) { FactoryBot.create(:user) }
  let(:third_project) { FactoryBot.create(:project,
                                          user_id: second_user.id) }
  let(:project_member) {
    FactoryBot.create(:project_member,
                      project_id: second_project.id,
                      user: second_user)
  }

  let(:pending_project_member) {
    FactoryBot.create(:project_member_pending,
                      project_id: second_project.id,
                      user: FactoryBot.create(:user))
  }

  let(:project_admin) {
    FactoryBot.create(:project_admin,
                      project_id: third_project.id,
                      user: user)
  }


  let(:json) { JSON(response.body) }


  context "logged in" do
    let(:headers) { credentials(user).merge("CONTENT_TYPE" => "application/json") }
    let(:headers_for_second_user) { credentials(second_user).merge("CONTENT_TYPE" => "application/json") }
    let(:headers_without_user) { { "CONTENT_TYPE" => "application/json" } }
    context "index" do
      context "should get a status 'success' and render projects" do
        it "if signed in as a creator" do
          get "/api/v1/projects",
               headers: headers
          expect(response).to have_http_status(:success)
          expect(json.map { |h| h["id"] }).to include(*user.projects.map(&:id))
        end
        it "signed in as an invited project member" do
          project_member.reload
          third_project.reload
          get "/api/v1/projects",
               headers: headers_for_second_user
          expect(response).to have_http_status(:success)
          expect(json.map { |h| h["id"] }.sort).to\
            include(*[project_member.project_id,
                      third_project.id].sort)
        end
        it "signed in as an invited project admin" do
          project_admin.reload
          get "/api/v1/projects",
               headers: headers
          expect(response).to have_http_status(:success)
          expect(json.map { |h| h["id"] }).to\
            eq([third_project.id])
        end
        it "signed in as invited project member who didn't accept invitation" do
          pending_project_member.reload
          second_project.reload
          get "/api/v1/projects",
               headers: headers_for_second_user
          expect(response).to have_http_status(:success)
          expect(json.map { |h| h["id"] }).not_to\
            include(pending_project_member.project_id)
        end
      end
    end
    context "show" do
      context "should get a status 'success' and render the project" do
        it 'if signed in as a creator' do
          get "/api/v1/projects/#{project.id}",
               headers: headers
          expect(response).to have_http_status(:success)
          expect(json.values).to include(project.name)
        end
        it "if signed in as an invited admin" do
          project_admin.reload
          get "/api/v1/projects/#{third_project.id}",
              headers: headers_for_second_user
          expect(response).to have_http_status(:success)
          expect(json.values).to include(third_project.name)
        end
        it 'if signed in as an invited member' do
          project_member.reload
          get "/api/v1/projects/#{second_project.id}",
              headers: headers_for_second_user
          expect(response).to have_http_status(:success)
          expect(json.values).to include(second_project.name)
        end
      end
      context "should get a status forbidden" do
        it "if signed in as member, but project is not completed" do
          new_project_member =
            FactoryBot.create(:project_member,
                              project_id: project.id,
                              user: second_user)
          get "/api/v1/projects/#{project.id}",
               headers: headers_for_second_user
          expect(response).to have_http_status(:forbidden)
          expect(json.values).not_to include(project.name)
        end
        it "if a signed in user hasn't accept the invitation" do
          pending_project_member.reload
          second_project.reload
          get "/api/v1/projects/#{second_project.id}",
               headers: headers_for_second_user
          expect(response).to have_http_status(:forbidden)
          expect(json.values).not_to include(second_project.name)
        end
        it "if a signed in user doesn't have the membership" do
          new_project = FactoryBot.create(:project)
          new_project.reload
          get "/api/v1/projects/#{new_project.id}",
               headers: headers
          expect(response).to have_http_status(:forbidden)
          expect(json.values).not_to include(new_project.name)          
        end
      end
    end
    context "edit" do
      context "should get a status 'success' and render the project" do
        it 'if signed in as a creator' do
          get "/api/v1/projects/#{project.id}/edit",
               headers: headers
          expect(response).to have_http_status(:success)
          expect(json.values).to include(project.name)
        end
        it "if signed in as an invited admin" do
          project_admin.reload
          get "/api/v1/projects/#{third_project.id}/edit",
              headers: headers
          expect(response).to have_http_status(:success)
          expect(json.values).to include(third_project.name)    
        end
      end
      context "should get a status forbidden" do
        it "if signed in as member, but project is not completed" do
          new_project_member =
            FactoryBot.create(:project_member,
                              project_id: project.id,
                              user: second_user)
          get "/api/v1/projects/#{project.id}/edit",
               headers: headers_for_second_user
          expect(response).to have_http_status(:forbidden)
          expect(json.values).not_to include(project.name)
        end
        it "if a signed in user hasn't accept the invitation" do
          pending_project_member.reload
          second_project.reload
          get "/api/v1/projects/#{second_project.id}/edit",
               headers: headers_for_second_user
          expect(response).to have_http_status(:forbidden)
          expect(json.values).not_to include(second_project.name)
        end
        it 'if signed in as an invited member' do
          project_member.reload
          get "/api/v1/projects/#{second_project.id}/edit",
              headers: headers_for_second_user
          expect(response).to have_http_status(:forbidden)
          expect(json.values).not_to include(second_project.name)
        end
        it "if a signed in user doesn't have the membership" do
          new_project = FactoryBot.create(:project)
          new_project.reload
          get "/api/v1/projects/#{new_project.id}/edit",
               headers: headers
          expect(response).to have_http_status(:forbidden)
          expect(json.values).not_to include(new_project.name)
        end
      end
    end
    context  "create (creation_step 'name')" do
      it 'should get a status "success" and add the name to the project' do
        post "/api/v1/projects",
          params: { project:
                    { name: "some name",
                      creation_step: "name" } }.to_json,
          headers: headers
        expect(response).to have_http_status(:success)
        expect(Project.last.name).to eq("some name")
      end
    end
    context "update" do
      context "creation_step 'name'" do
        it 'should get a status "success" and change the name of the project' do
          patch "/api/v1/projects/#{project.id}",
            params: { project:
                      { name: "some name",
                        creation_step: "name" } }.to_json,
            headers: headers
          expect(response).to have_http_status(:success)
          expect(Project.find_by(id: project.id).name).to eq("some name")
        end
        it 'should get a status "error" and don\'t
            change the name of the project' do
          patch "/api/v1/projects/#{project.id}",
            params: { project:
                      { name: "12",
                        creation_step: "name" } }.to_json,
            headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
          expect(Project.find_by(id: project.id).name).not_to eq("12")
        end
      end
      context "creation_step 'company_data'" do
        it 'should get a status "success" and add a company data to the project' do
          patch "/api/v1/projects/#{project.id}",
            params: {
              project: FactoryBot.attributes_for(:project_company_data_step)
                        .merge(company_data: FactoryBot.attributes_for(:project_company_data)
                        .merge(company_address: FactoryBot.attributes_for(:address)))
            }.to_json,
            headers: headers
          expect(response).to have_http_status(:success)
          expect(Project.find_by(id: project.id).company_data).to be_present
          expect(Project.find_by(id: project.id).company_data.billing_address).not_to be_present
        end
        it 'should get a status "success" and add billing address to the project' do
          patch "/api/v1/projects/#{project.id}",
            params: {
              project: FactoryBot.attributes_for(:project_company_data_step)
                        .merge(company_data: FactoryBot.attributes_for(:project_company_data,
                                               same_for_billing_address: "1")
                        .merge(company_address: FactoryBot.attributes_for(:address)))
            }.to_json,
            headers: headers
          expect(response).to have_http_status(:success)
          expect(Project.find_by(id: project.id).company_data.billing_address).to be_present
        end
        it 'should get a status "error" and don\'t
            add a company data to the project' do
          patch "/api/v1/projects/#{project.id}",
            params: {
              project: FactoryBot.attributes_for(:project_company_data_step)
            }.to_json,
            headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
          expect(Project.find_by(id: project.id).company_data).not_to be_present
        end
      end
      context "creation_step 'billing_address'" do
        it 'should get a status "success" and add a billing_address to the project' do
          project_without_billing_address =
            FactoryBot.create(:project_pre_billing_address_step,
                               user_id: user.id)
          patch "/api/v1/projects/#{project_without_billing_address.id}",
            params: {
              project: {
                creation_step: "billing_address",
                company_data: {
                  billing_address: FactoryBot.attributes_for(:address)
                }
              }
            }.to_json,
            headers: headers

          updated_project =
            Project.find_by(id: project_without_billing_address.id)
          expect(response).to have_http_status(:success)
          expect(updated_project.company_data.billing_address).to be_present
          expect(updated_project.creation_step).to eq("done")
        end
        it "should get a status 'error' and don't
            add a billing_address to the project" do
          project_without_billing_address =
            FactoryBot.create(:project_pre_billing_address_step,
                               user_id: user.id)
          patch "/api/v1/projects/#{project_without_billing_address.id}",
            params: {
              project: {
                creation_step: "billing_address",
                company_data: {
                  billing_address: { street: "unknown" }
                }
              }
            }.to_json,
            headers: headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(Project.find_by(id: project_without_billing_address.id)
                                       .company_data
                                       .billing_address).not_to be_present
          expect(Project.find_by(id: project_without_billing_address.id)
                                .creation_step).not_to eq("done")
        end
      end

      context "logo" do
        let(:completed_project) {
          FactoryBot.create(:project, user_id: user.id)
        }
        it "should be added" do
          patch "/api/v1/projects/#{completed_project.id}",
            params: {
              project: { company_data: { logo: fixture_file_upload('test.txt') } }
            },
            headers: headers
          completed_project.reload
          expect(response).to have_http_status(:success)
          expect(completed_project.company_data.logo).to be_attached
        end
        it "should be removed" do
          completed_project.company_data.logo.attach(fixture_file_upload('test.txt'))
          patch "/api/v1/projects/#{completed_project.id}",
            params: {
              project: { company_data: { remove_logo: "1" } }
            }.to_json,
            headers: headers
          completed_project.reload
          expect(response).to have_http_status(:success)
          expect(completed_project.company_data.logo).not_to be_attached
        end
      end
    end

    context "destroy" do
      it "should be destroyed" do
        third_project = FactoryBot.create(:project_name_step, user_id: user.id)
        delete "/api/v1/projects/#{third_project.id}",
              headers: headers
        expect(response).to have_http_status(:success)
        expect(Project.find_by(id: third_project.id)).to be_falsy
      end
    end

    context "confirm_member" do
      context "when project member doesn't have a user" do
        it "shouldn't confirm a member with a wrong or without a user" do
          project_member =
            FactoryBot.create(:project_member_pending)
          get "/api/v1/projects/confirm_member?token=#{project_member.confirmation_token}",
            headers: [ headers_for_second_user, headers_without_user ].sample
          expect(response).to have_http_status(:not_found)
          expect(project_member.reload.creation_step_active?).to be_falsy
          expect(json["project_member"]["id"]).to eq project_member.id
        end
        it "shouldn't confirm a member with a wrong token" do
          project_member =
            FactoryBot.create(:project_member_pending)
          get "/api/v1/projects/confirm_member?token=54353454",
            headers: headers_without_user
          expect(response).to have_http_status(:unprocessable_entity)
          expect(ProjectMember.find_by(id: project_member.id).user).to eq(nil)
        end
      end
      context "when project member has a user" do
        it "should confirm a member" do
          project_member =
            FactoryBot.create(:project_member_pending)
          project_member.update(email: second_user.email)
          get "/api/v1/projects/confirm_member?token=#{project_member.confirmation_token}",
            headers: headers_for_second_user
          expect(response).to have_http_status(:success)
          expect(ProjectMember.find_by(id: project_member.id).user).to eq(second_user)
        end
        it "should't confirm a member with a different or without a signed_in_user" do
          project_member =
            FactoryBot.create(:project_member_pending, email: user.email)
          get "/api/v1/projects/confirm_member?token=#{project_member.confirmation_token}",
            headers: [ headers_for_second_user, headers_without_user ].sample
          expect(response).to have_http_status(:unauthorized)
          expect(project_member.reload.creation_step_active?).to be_falsy
        end
      end
    end

    context "invite" do
      it "should invite members" do
        member_ids =
          FactoryBot.create_list(:project_member_pending,
                                 2,
                                 project: project).map(&:id)
        post "/api/v1/projects/#{project.id}/invite",
             params: { project_member_ids: member_ids }.to_json,
             headers: headers
        expect(response).to have_http_status(:ok)
        expect(ActionMailer::Base.deliveries.map(&:to).map(&:first).sort).to\
          eq((project.members.map(&:email) - [project.members.where(creation_step: "active").first.email]).sort)
        expect(ProjectMember.where(id: member_ids).first.inviter_id).to eq(user.id)
      end
      it "shouldn't invite members" do
        post "/api/v1/projects/#{project.id}/invite",
             params: { project_member_ids: [] }.to_json,
             headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(ActionMailer::Base.deliveries.count).to eq(0)
      end
    end

    context "update_project_code" do
      it "valid" do
        post "/api/v1/projects/#{project.id}/update_project_code",
             params: { project_code: 'AAA' }.to_json,
             headers: headers
        expect(response).to have_http_status(:ok)
        expect(project.reload.project_code).to eql('AAA')
      end

      it "invalid" do
        post "/api/v1/projects/#{project.id}/update_project_code",
             params: { project_code: 'aaa' }.to_json,
             headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'dms_users' do
      it 'project admin' do
        get "/api/v1/projects/#{project.id}/dms_users",
           headers: headers
        expect(response).to have_http_status(:success)
        expect(json.length).to eql(1)
      end

      it 'user with dms access' do
        user = FactoryBot.create(:user)
        project.members.create!(user: user,
                                dms_module_access: true,
                                employment_type: :employee)
        get "/api/v1/projects/#{project.id}/dms_users",
           headers: credentials(user)
        expect(response).to have_http_status(:success)
        expect(json.length).to eql(2)
        expect(json.first).to have_key('id')
      end

      it 'scope teams' do
        team = FactoryBot.create(:dms_team)
        team.update!(project: project)
        get "/api/v1/projects/#{project.id}/dms_users?scope=teams",
           headers: headers
        expect(response).to have_http_status(:success)
        expect(json.length).to eql(1)
      end

      it 'scope teams' do
        team = FactoryBot.create(:dms_team)
        team.update!(project: project)
        team.users << User.last
        get "/api/v1/projects/#{project.id}/dms_users?scope=teams",
           headers: headers
        expect(response).to have_http_status(:success)
        expect(json.length).to eql(0)
      end
    end

    context 'dms_teams' do
      before do
        team = project.dms_teams.create
        team.users << project.user
      end

      it 'project admin' do
        get "/api/v1/projects/#{project.id}/show_dms_teams",
           headers: headers
        expect(response).to have_http_status(:success)
        expect(json.length).to eql(1)
      end

      it 'user with dms access' do
        user = FactoryBot.create(:user)
        project.members.create!(user: user,
                                dms_module_access: true,
                                employment_type: :employee)
        get "/api/v1/projects/#{project.id}/show_dms_teams",
           headers: credentials(user)
        expect(response).to have_http_status(:success)
        expect(json.length).to eql(1)
        expect(json.first).to have_key('name')
        expect(json.first).to have_key('users')
        expect(json.first['users'].length).to eql(1)
      end
    end
  end

  context 'not logged in and should get a status "forbidden" on' do
    let(:headers) { { "CONTENT_TYPE" => "application/json" } }
    it 'index' do
      get "/api/v1/projects",
           headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'show' do
      get "/api/v1/projects/#{project.id}",
           headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'edit' do
      get "/api/v1/projects/#{project.id}/edit",
           headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'create' do
      post "/api/v1/projects",
           params: { project: { name: "some name" } }.to_json,
           headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'update' do
      patch "/api/v1/projects/#{project.id}",
           params: { project: { name: "some name" } }.to_json,
           headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'destroy' do
      delete "/api/v1/projects/#{project.id}",
           headers: headers
      expect(response).to have_http_status(:forbidden)
    end

    it 'confirm_member (exclusion) should be accessing anyway' do
      project_member = FactoryBot.create(:project_member)
      get "/api/v1/projects/confirm_member?token=#{project_member.confirmation_token}",
          headers: headers
      expect(response).to have_http_status(422)
    end

    it 'invite' do
      member_ids =
        FactoryBot.create_list(:project_member_pending,
                               2,
                               project: project).map(&:id)
      post "/api/v1/projects/#{project.id}/invite",
           params: { project_member_ids: member_ids }.to_json,
           headers: headers
      expect(response).to have_http_status(:forbidden)
      expect(ActionMailer::Base.deliveries.count).to eq(0)
    end

    it 'update_project_code' do
        post "/api/v1/projects/#{project.id}/update_project_code",
             params: { project_code: 'AAA' }.to_json,
             headers: headers
      expect(response).to have_http_status(:forbidden)
      expect(project.reload.project_code).to be_nil
    end

    it 'dms_users' do
      get "/api/v1/projects/#{project.id}/dms_users",
         headers: headers
      expect(response).to have_http_status(:forbidden)
    end

    it 'dms_teams' do
      get "/api/v1/projects/#{project.id}/show_dms_teams",
         headers: headers
      expect(response).to have_http_status(:forbidden)
    end
  end
end
