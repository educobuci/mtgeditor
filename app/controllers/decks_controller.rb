class DecksController < ApplicationController  
  respond_to :html
  
  def edit
  end
  
  def new
    @deck = Deck.new
    respond_with @deck
  end
  
end