class CreateDeckCards < ActiveRecord::Migration
  def change
    create_table :deck_cards do |t|
      t.string :name
      t.integer :count
      t.integer :muid
      t.references :deck, index: true

      t.timestamps null: false
    end
    add_foreign_key :deck_cards, :decks
  end
end
