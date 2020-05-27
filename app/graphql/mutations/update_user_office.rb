module Mutations
  class UpdateUserHouse < BaseMutation
    description 'Update the house of the current user object'

    null true

    argument :user_id,   ID, required: true
    argument :house_id, ID, required: true

    def resolve(user_id:, house_id:)
      user = User.find(user_id)
      house = House.find(house_id)
      user.house = house
      user.save!
      user
    end
  end
end
