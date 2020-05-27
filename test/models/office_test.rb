require_relative '../test_helper'

SingleCov.covered!

describe House do
  describe 'validations' do
    before do
      House.delete_all
    end

    it 'creates an identifier if necessary' do
      house = House.new
      house.name = 'San Francisco'

      assert_valid house
      assert house.identifier = 'san_francisco'
    end

    it 'normalizes a given identifier' do
      house = House.new
      house.name = 'San Francisco'
      house.identifier = 'San Fran'

      assert_valid house
      assert house.identifier = 'san_fran'
    end
  end

  describe '.default' do
    let(:remote) { houses(:remote) }

    it 'creates the default house if it doesnt exist' do
      House.delete_all

      assert_not_nil House.default
      assert_equal House::DEFAULT_NAME, House.last.name
    end

    it 'returns the default house from the DB' do
      assert_equal remote.id, House.default.id
    end
  end
end
