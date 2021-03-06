require 'rails_helper'

describe DocumentFolder, type: :request do
  let(:json) { JSON(response.body) }

  context '#create' do
    let(:title) { Faker::Lorem.sentence }
    let(:project) { FactoryBot.create(:project) }
    let(:convention) { project.conventions.active }
    let(:folder_params) do
      { document_folder: {
        title: title,
        project_id: project.id
      } }
    end
    let(:user) { FactoryBot.create(:user) }

    it 'anon' do
      post '/api/v1/document_folders', params: folder_params
      expect(response).to have_http_status(:forbidden)
    end

    it 'user' do
      post '/api/v1/document_folders', params: folder_params, headers: credentials(user)
      expect(response).to have_http_status(:success)
      folder = DocumentFolder.first
      expect(folder.title).to eql(title)
      expect(folder.user).to eql(user)
      expect(folder.project).to eql(project)
    end
  end

  context '#edit' do
    let(:document_folder) { FactoryBot.create(:document_folder) }
    let(:user) { document_folder.user }

    it 'anon' do
      get "/api/v1/document_folders/#{document_folder.id}/edit"
      expect(response).to have_http_status(:forbidden)
    end

    it 'user' do
      get "/api/v1/document_folders/#{document_folder.id}/edit", headers: credentials(user)
      expect(response).to have_http_status(:success)
      expect(json['title']).to eql(document_folder.title)
      expect(json['document_fields'].length).to eql(4)
    end
  end

  context '#update' do
    let(:document_folder) { FactoryBot.create(:document_folder) }
    let(:user) { document_folder.user }
    let(:title) { Faker::Lorem.sentence }
    let(:folder_params) { { document_folder: { title: title } } }

    it 'anon' do
      patch "/api/v1/document_folders/#{document_folder.id}", params: folder_params
      expect(response).to have_http_status(:forbidden)
    end

    it 'user' do
      patch "/api/v1/document_folders/#{document_folder.id}", params: folder_params, headers: credentials(user)
      expect(response).to have_http_status(:success)
      expect(json['title']).to eql(title)
    end
  end

  context '#show' do
    let(:document_folder) { FactoryBot.create(:document_folder) }
    let(:user) { document_folder.user }
    let!(:document) { FactoryBot.create(:document) }

    it 'anon' do
      get "/api/v1/document_folders/#{document_folder.id}"
      expect(response).to have_http_status(:forbidden)
    end

    it 'user' do
      allow(DocumentFolder).to receive(:find).and_return(document_folder)
      allow(document_folder).to receive(:all_documents).and_return(Document.all)
      get "/api/v1/document_folders/#{document_folder.id}", headers: credentials(user)
      expect(response).to have_http_status(:success)
      expect(json[0]['id']).to eql(document.id)
      expect(json[0]['document_fields'].length).to eql(9)
      expect(json[0]['document_fields'].detect{ |i| i['codification_kind'] == 'originating_company' }['document_field_values'].length).to eql(1)
    end
  end

  context '#index' do
    let!(:document_folder1) { FactoryBot.create(:document_folder) }
    let(:user) { document_folder1.user }
    let(:project) { document_folder1.project }
    let!(:document_folder2) { FactoryBot.create(:document_folder, user: user, project: project) }
    let!(:document) { FactoryBot.create(:document) }

    it 'anon' do
      get "/api/v1/projects/#{project.id}/document_folders", params: { document_id: document.id }
      expect(response).to have_http_status(:forbidden)
    end

    it 'user' do
      document_folder1.document_mains << document.revision.document_main
      get "/api/v1/projects/#{project.id}/document_folders", headers: credentials(user), params: { document_id: document.id }
      expect(response).to have_http_status(:success)
      expect(json.count).to eql(2)
      expect(json[0]['id']).to eql(document_folder1.id)
      expect(json[0]['enabled']).to eql(true)
      expect(json[1]['id']).to eql(document_folder2.id)
      expect(json[1]['enabled']).to eql(false)
    end
  end

  context '#user_index' do
    let!(:document_folder1) { FactoryBot.create(:document_folder) }
    let(:user) { document_folder1.user }
    let(:project) { document_folder1.project }
    let!(:document_folder2) { FactoryBot.create(:document_folder, user: user, project: project) }

    it 'anon' do
      get "/api/v1/projects/#{project.id}/document_folders/user_index"
      expect(response).to have_http_status(:forbidden)
    end

    it 'user' do
      get "/api/v1/projects/#{project.id}/document_folders/user_index", headers: credentials(user)
      expect(response).to have_http_status(:success)
      expect(json.count).to eql(2)
      expect(json[0]['id']).to eql(document_folder1.id)
      expect(json[1]['id']).to eql(document_folder2.id)
    end
  end

  context '#add_document_to_folders' do
    let(:document_folder1) { FactoryBot.create(:document_folder) }
    let(:document_folder2) { FactoryBot.create(:document_folder) }
    let(:user) { document_folder1.user }
    let!(:document) { FactoryBot.create(:document) }
    let(:folder_params) { { document_id: document.id, document_folder_ids: DocumentFolder.all.pluck(:id) } }

    it 'anon' do
      post '/api/v1/document_folders/add_document_to_folders', params: folder_params
      expect(response).to have_http_status(:forbidden)
    end

    it 'user' do
      allow(DocumentFolder).to receive(:find).and_return(document_folder1)
      allow(document_folder1).to receive(:allowed_to_add_document?).and_return(true)
      post '/api/v1/document_folders/add_document_to_folders', params: folder_params, headers: credentials(user)
      expect(response).to have_http_status(:success)
      doc_ids1 = document_folder1.document_mains.pluck(:id)
      doc_ids2 = document_folder2.document_mains.pluck(:id)
      document_main_id = document.revision.document_main.id
      expect(doc_ids1).to include(document_main_id)
      expect(doc_ids2).to_not include(document_main_id)
    end
  end
end
