require 'rails_helper'

describe "Role", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project,
                                    user_id: user.id) }
  let(:project_member) { FactoryBot.create(:project_member,
                                           project_id: project.id) }
  let(:role) { project.roles.last }
  let(:json) { JSON(response.body) }

  context "logged in" do
    let(:headers) { credentials(user).merge("CONTENT_TYPE" => "application/json") }
    context "index" do
      it 'should get a status "success" and render roles' do
        get "/api/v1/projects/#{project.id}/roles",
            headers: headers
        expect(response).to have_http_status(:success)
        expect(json.map { |h| h["title"] }).to\
          include(*project.roles.map(&:title))
      end
    end
    context "edit" do
      it 'should get a status "success" and render the role' do
        get "/api/v1/projects/#{project.id}/roles/#{role.id}/edit",
            headers: headers
        expect(response).to have_http_status(:success)
        expect(json["title"]).to include(*role.title)
      end
    end
    context "create" do
      it 'should get a status "success" and create a role' do
        post "/api/v1/projects/#{project.id}/roles",
             params: { role: { title: "some field" } }.to_json,
             headers: headers
        expect(response).to have_http_status(:success)
        expect(project.roles.count).to eq(27)
      end
      it "should get a status 'error' and don't create a role" do
        post "/api/v1/projects/#{project.id}/roles",
             params: { role: { title: " " } }.to_json,
             headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(project.roles.count).to eq(26)
      end
    end
    context "update" do
      it 'should get a status "success" and update a role' do
        patch "/api/v1/projects/#{project.id}/roles/#{role.id}",
             params: { role: { title: "new title" } }.to_json,
             headers: headers
        expect(response).to have_http_status(:success)
        expect(json["title"]).to eq("new title")
      end
      it "should get a status 'error' and don't update the role" do
        patch "/api/v1/projects/#{project.id}/roles/#{role.id}",
             params: { role: { title: " " } }.to_json,
             headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(role.title).not_to eq(" ")
      end
    end
    context "destroy" do
      it "should get a status 'success' and destroy the role" do
        delete "/api/v1/projects/#{project.id}/roles/#{role.id}",
               headers: headers
        expect(response).to have_http_status(:success)
        expect(Role.find_by(id: role.id)).to be_falsy
      end
    end
  end
  context 'not logged in and should get a status "forbidden" on' do
    let(:headers) { { "CONTENT_TYPE" => "application/json" } }
    it 'index' do
      get "/api/v1/projects/#{project.id}/roles",
          headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'edit' do
      get "/api/v1/projects/#{project.id}/roles/#{role.id}/edit",
          headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'create' do
      post "/api/v1/projects/#{project.id}/roles",
           params: { role: { title: "some field" } }.to_json,
           headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'update' do
      patch "/api/v1/projects/#{project.id}/roles/#{role.id}",
            params: { role: { title: "some field" } }.to_json,
            headers: headers
      expect(response).to have_http_status(:forbidden)
    end
    it 'destroy' do
      delete "/api/v1/projects/#{project.id}/roles/#{role.id}",
             headers: headers
      expect(response).to have_http_status(:forbidden)
    end
  end
end