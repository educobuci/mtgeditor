class AddMainboardToDeckCards < ActiveRecord::Migration
  def change
    add_column :deck_cards, :mainboard, :boolean
    add_column :deck_cards, :set, :string
    add_column :deck_cards, :condition, :integer
    add_column :deck_cards, :foil, :boolean
  end
end
