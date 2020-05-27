class AddTimezoneToHouses < ActiveRecord::Migration[5.0]
  def change
    add_column :houses, :timezone, :string
  end
end
