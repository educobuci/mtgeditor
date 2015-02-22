class Deck < ActiveRecord::Base
  belongs_to :user
  has_many :deck_cards
  
  validates :name, presence: true
  validates :user, presence: true
end
