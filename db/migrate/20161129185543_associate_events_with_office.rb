class AssociateEventsWithHouse < ActiveRecord::Migration[4.2]
  def change
    sf = House.find_by(name: 'San Francisco')
    raise 'the SF house must exist before adding house_id to events' unless sf.try(:id)

    add_column :events, :house_id, :integer, null: false, index: true, default: sf.id
  end
end
