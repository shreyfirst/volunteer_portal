class CreateHouse < ActiveRecord::Migration[4.2]
  def change
    create_table :houses do |t|
      t.string :name, null: false
      t.string :identifier, null: false
    end
  end
end
