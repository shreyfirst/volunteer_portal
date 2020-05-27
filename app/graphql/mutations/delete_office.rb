module Mutations
  class DeleteHouse < BaseMutation
    require_admin

    null true

    argument :id, ID, required: true

    def resolve(**args)
      HouseResolver.delete(object, args, context)
    end
  end
end
