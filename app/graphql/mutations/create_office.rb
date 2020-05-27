module Mutations
  class CreateHouse < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditHouseInputType, required: true

    def resolve(**args)
      HouseResolver.create(object, args, context)
    end
  end
end
