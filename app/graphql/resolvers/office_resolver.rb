module HouseResolver
  NAME_DESC = 'NAME_DESC'.freeze
  NAME_ASC = 'NAME_ASC'.freeze

  class << self
    def all(_object, args, _context)
      scope = House.all

      scope = scope_with_sort_by(scope, args[:sort_by])

      scope
    end

    def create(_, args, _context)
      house = House.new(args[:input].to_h)
      house.save!

      house
    end

    def update(_, args, _context)
      house = House.find(args[:input].id)
      house.update!(args[:input].to_h.except(:id))

      house
    end

    def delete(_, args, _context)
      house = House.find(args[:id])
      house.destroy!

      house
    end

    def scope_with_sort_by(scope, sort_by)
      return scope unless sort_by

      query_string = case sort_by
                     when NAME_DESC
                       'name DESC'
                     when NAME_ASC
                       'name ASC'
                     end

      scope.order(query_string)
    end
  end
end
