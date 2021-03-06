require 'rails_helper'

describe Api::V1::ContactsController, type: :routing do
  it { expect(post("/api/v1/users")).to\
      route_to("api/v1/users#create") }

  it { expect(put("/api/v1/users/1")).to\
      route_to("api/v1/users#update", id: "1") }

  it { expect(delete("/api/v1/users/1")).to\
      route_to("api/v1/users#destroy", id: "1") }

  it { expect(get("/api/v1/users/confirm")).to\
      route_to("api/v1/users#confirm") }
end