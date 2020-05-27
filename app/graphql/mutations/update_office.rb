module Mutations
  class UpdateHouse < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditHouseInputType, required: true

    def resolve(**args)
      HouseResolver.update(object, args, context)
    end
  end
end
