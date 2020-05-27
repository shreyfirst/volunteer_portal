class DropHouseLocation < ActiveRecord::Migration[5.1]
  def up
    remove_column :signups, :house_location
    remove_column :users, :house_location
    remove_column :volunteers, :house_location
  end

  def down
    add_column :signups, :house_location, :string
    add_column :users, :house_location, :string
    add_column :volunteers, :house_location, :string
  end
end
