module Types::Enum
  class HouseSortEnum < BaseEnum
    graphql_name 'HouseSortEnum'
    description 'How to sort the resulting list of houses'

    value HouseResolver::NAME_DESC, 'Sort houses by name in descending order'
    value HouseResolver::NAME_ASC, 'Sort houses by name in ascending order'
  end
end
