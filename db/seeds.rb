Role::MAPPING.each do |id, name|
  Role.find_or_create_by(id: id, name: name)
end

zendesk = Organization.find_or_create_by!(name: 'Zendesk') do |org|
  org.description = 'Test Organization.'
  org.location    = '989 Market St, San Francisco CA, 94103'
  org.website     = 'www.zendesk.com'
end

university = Organization.find_or_create_by!(name: 'University of Wisconsin') do |org|
  org.description = 'University of Wisconsin-Madison'
  org.location    = 'Madison, WI 53706'
  org.website     = 'http://www.wisc.edu/'
end

[
  'Tutoring', 'Meal Service', 'Mock Interviews', 'Sorting Clothes',
  'Event Assistance', 'Bingo', 'Cleaning/Organizing', 'Street Cleaning',
  'Kitchen Prep', 'Harm Reduction Kit Assembly', 'Gardening'
].each { |et| EventType.find_or_create_by(title: et) }

[
  'New Hire', 'Skilled', 'Sustainability'
].each { |tag| Tag.find_or_create_by(name: tag) }

sf = House.find_or_create_by!(name: 'San Francisco') do |house|
  house.timezone = 'America/Los_Angeles'
end

madison = House.find_or_create_by!(name: 'Madison') do |house|
  house.timezone = 'America/Chicago'
end

user1 = User.find_or_create_by!(email: 'agent1@example.com') do |u|
  u.first_name   = 'Bartolomé'
  u.last_name    = 'Bagent'
  u.house       = sf
  u.google_token = 'barty_token'
end

user2 = User.find_or_create_by!(email: 'agent2@example.com') do |u|
  u.first_name   = 'Angela'
  u.last_name    = 'Agent'
  u.house       = sf
  u.google_token = 'angelic_token'
end

user3 = User.find_or_create_by!(email: 'buckybadger@example.com') do |u|
  u.first_name   = 'Bucky'
  u.last_name    = 'Badger'
  u.house       = madison
  u.google_token = "bucky_token"
end

event1 = zendesk.events.create!(
  title: 'Zendesk Hackaton.',
  description: 'This is a Hackaton.',
  starts_at: (Time.zone.now + 1.hour),
  ends_at: (Time.zone.now + 12.hours),
  capacity: 600,
  type: EventType.find_by(title: 'Tutoring'),
  location: 'Hacking a ton Location',
  house: sf,
  tags: Tag.where(name: 'New Hire')
)

event2 = university.events.create!(
  title: 'Tutoring',
  description: 'Tutoring students',
  starts_at: (Time.zone.now + 1.day),
  ends_at: (Time.zone.now + 1.day + 2.hours),
  capacity: 600,
  type: EventType.find_by(title: 'Tutoring'),
  location: 'University of Wisconsin-Madison',
  house: madison,
  tags: Tag.where(name: 'New Hire')
)

event1.users << user1
event1.users << user2

event2.users << user3

if %w[development test].include?(Rails.env)
  User.find_or_create_by!(email: 'sfadmin@example.com') do |u|
    u.first_name            = 'Volunteer'
    u.last_name             = 'Admin'
    u.house                = sf
    u.role                  = Role.find_by(name: 'admin')
  end

  User.find_or_create_by!(email: 'sfvolunteer@example.com') do |u|
    u.first_name            = 'SF'
    u.last_name             = 'Volunteer'
    u.house                = sf
  end
end
