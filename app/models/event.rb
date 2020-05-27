class Event < ApplicationRecord
  CALENDAR_TIME_FORMAT = '%Y%m%dT%H%M%SZ'.freeze
  has_soft_deletion default_scope: false

  # inverse_of on signups causes duplicate Avatars when signing up. Disable rubocop until cause is found
  # rubocop:disable Rails/InverseOf
  has_many :signups, -> { auto_include(false) }, dependent: :destroy
  # rubocop:enable Rails/InverseOf

  # this custom association is to reduce data loaded and memory used when fetching users for an event
  has_many :signups_for_through, -> { select(:event_id, :user_id) }, class_name: 'Signup', inverse_of: :event
  has_many :users, through: :signups_for_through
  has_many :event_tags, dependent: :destroy
  has_many :tags, through: :event_tags

  belongs_to :organization
  belongs_to :event_type
  belongs_to :type, class_name: 'EventType', foreign_key: 'event_type_id', inverse_of: :events
  belongs_to :house
  belongs_to :event_group

  validates :organization, :title, :type, :starts_at, :ends_at, :capacity, :location, :house, presence: true
  validates :capacity, numericality: { only_integer: true }

  validate :max_capacity
  validate :time_sequentiality

  before_save :set_duration

  scope :before,     ->(time) { where("starts_at < ?", time) }
  scope :after,      ->(time) { where("starts_at > ?", time) }
  scope :in_month,   ->(month) { where('EXTRACT(MONTH from starts_at) = ?', month) }
  scope :for_house, ->(house_id) { where(house_id: house_id) }

  # can't connect to redis yet, so no ActionCable
  # after_create_commit  :notify_websocket_of_create
  # after_destroy_commit :notify_websocket_of_destroy

  def sign_up_user!(user)
    users << user
  rescue ActiveRecord::RecordInvalid
    if signups.last.errors.any? && signups.last.user_id == user.id
      errors.add(:users, signups.last.errors.full_messages)
    else
      errors.add(:users, "Failed to signup user")
    end
  end

  def assign_tag(tag)
    tags << tag
  end

  def remove_user!(user)
    users.delete(user)
    save
  end

  private

  def max_capacity
    errors.add(:users, "total can't be above capacity") if capacity && users.size > capacity
  end

  def time_sequentiality
    errors.add(:ends_at, "should not end before it starts") if (starts_at && ends_at) && (starts_at > ends_at)
  end

  def notify_websocket_of_create
    notify_websocket(:create)
  end

  def notify_websocket_of_destroy
    notify_websocket(:destroy)
  end

  def notify_websocket(action_type)
    ActionCable.server.broadcast 'events', type: action_type, event: self
  end

  def set_duration
    self.duration = (ends_at - starts_at) / 60 if ends_at_changed? || starts_at_changed?
  end
end
