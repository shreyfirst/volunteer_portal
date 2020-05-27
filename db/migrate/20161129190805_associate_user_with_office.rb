class AssociateUserWithHouse < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :house_id, :integer, index: true
  end
end
