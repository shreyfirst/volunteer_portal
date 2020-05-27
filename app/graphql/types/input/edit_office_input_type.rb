module Types::Input
  class EditHouseInputType < BaseInputObject
    graphql_name "EditHouseInputType"
    description "Properties for creating or updating an House"

    argument :id, ID, required: false, description: "Provide an id to update an existing house, or no id for creation"
    argument :name, String, required: true
    argument :timezone, String, required: true, description: "Timezone most events associated with this house happen in"
  end
end
