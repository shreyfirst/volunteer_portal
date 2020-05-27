module Types
  class HouseGraphType < BaseObject
    graphql_name 'House'
    description 'An house'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    field :id,         ID,     null: false
    field :name,       String, null: false
    field :identifier, String, null: false, description: 'A machine-readable version of the house name'

    field :timezone, String,
          null: false,
          description: 'Timezone name from the [Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) e.g. "America/Los_Angeles"'
    def timezone
      object.timezone || ApplicationRecord::DEFAULT_TIMEZONE
    end
  end
end
