class DeckCardsController < ApplicationController
  respond_to :json
  
  def create
    deck = Deck.find(params[:deck_id])
    if user_signed_in? && current_user.id == deck.user.id
      deck_cards_params = ActiveSupport::JSON.decode(params[:cards])
      deck_cards_params.each do |card_params|
        deck_card = DeckCard.find_or_initialize_by(id: card_params["id"], deck_id: deck.id)
      
        unless card_params["count"].to_i <= 0
          deck_card.deck = deck
          deck_card.update_attributes(card_params.except(:id));
        else
          deck_card.delete
        end
      end
      respond_to do |format|
        format.json { render json: deck.deck_cards }
      end
    end
  end
  
  def index
    deck = Deck.find(params[:deck_id])
    respond_to do |format|
      format.json { render json: deck.deck_cards }
    end
  end
end