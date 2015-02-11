class CreateDecks < ActiveRecord::Migration
  def change
    create_table :decks do |t|
      t.string :name
      t.boolean :public
      t.string :description
      t.string :format
      t.references :user, index: true

      t.timestamps null: false
    end
    add_foreign_key :decks, :users
  end
end
