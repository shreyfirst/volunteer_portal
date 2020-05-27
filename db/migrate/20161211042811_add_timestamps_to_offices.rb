class AddTimestampsToHouses < ActiveRecord::Migration[4.2]
  def change
    add_column :houses, :created_at, :datetime
    add_column :houses, :updated_at, :datetime
    add_index :houses, :updated_at
  end
end
