class RegistrationConfirmation
  include ActiveModel::Model
  include ActiveModel::Validations

  attr_accessor :token

  def initialize(attributes = {})
    attributes.each do |name, value|
      send("#{name}=", value)
    end

    @data = ::JsonWebToken.decode(token) || {}
    @user =
      User.find_by(id: @data["user_id"])
  end

  def save
    valid? && @user.update_column(:confirmed_at, Time.now)
  end

  validates_presence_of :token

  validate :token_validity,
           :user_exists,
           :already_confirmed

  def persisted?
    false
  end

  private

  def token_validity
    errors.add(:token, :invalid) unless ::JsonWebToken.decode(token).present?
  end

  def user_exists
    errors.add(:token, :user_is_not_found) unless @user.present?
  end

  def already_confirmed
    errors.add(:token, :user_is_already_confirmed) if @user.try(:confirmed?)
  end
end