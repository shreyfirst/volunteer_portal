require_relative '../../test_helper'

SingleCov.covered!

describe AssociationLoader do
  let(:house) { houses(:remote) }
  let(:user) { users(:admin) }

  before do
    user.house = house
    user.save!
    user.reload
  end

  it 'loads the correct association' do
    result = GraphQL::Batch.batch do
      AssociationLoader.for(User, :house).load(user)
    end

    _(result.id).must_equal house.id
  end

  it 'uses the scope passed in' do
    result = GraphQL::Batch.batch do
      AssociationLoader.for(User, :house, scope: House.where(name: 'Fake Name')).load(user)
    end

    _(result).must_be_nil
  end

  it 'validates the association' do
    assert_raises ArgumentError do
      GraphQL::Batch.batch do
        AssociationLoader.for(User, :foobar)
      end
    end
  end
end
