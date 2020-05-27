require_relative '../../test_helper'

SingleCov.covered!

describe RecordLoader do
  let(:house) { houses(:san_francisco) }
  let(:remote_house) { houses(:remote) }

  it 'loads all records' do
    houses = GraphQL::Batch.batch do
      RecordLoader.for(House).load_many([house.id, remote_house.id])
    end

    _(houses.map(&:id).sort).must_equal [house.id, remote_house.id].sort
  end

  it 'uses the where clause when passed in' do
    houses = GraphQL::Batch.batch do
      RecordLoader.for(House, where: { name: house.name }).load_many([house.id, remote_house.id])
    end

    _(houses.compact.map(&:id)).must_equal [house.id]
  end
end
