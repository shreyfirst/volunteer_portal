class InsertSfHouse < ActiveRecord::Migration[4.2]
  def up
    House.find_or_create_by!(name: 'San Francisco')
  end
end
