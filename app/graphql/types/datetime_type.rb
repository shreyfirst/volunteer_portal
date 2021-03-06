module Types
  class DatetimeType < BaseScalar
    graphql_name 'Datetime'
    description 'UTC Timestamp in ISO8601 format'

    def self.coerce_input(value, _ctx)
      Time.zone.parse(value)
    end

    def self.coerce_result(value, _ctx)
      value.utc.iso8601
    end
  end
end
