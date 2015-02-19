class DecksController < ApplicationController  
  respond_to :html, :json
  
  def edit
    @deck = Deck.find(params[:id])
    respond_with @deck
  end
  
  def new
    @deck = Deck.new
    respond_with @deck
  end
  
  def create
    if user_signed_in?
      @deck = Deck.new(deck_params)
      @deck.user = current_user
      respond_with @deck do |format|
        if @deck.save
          format.json { render json: @deck }
        else
          format.json { render json: @deck.errors.messages, status: :precondition_failed }
        end
      end
    else
      head :forbidden
    end
  end
  
  def update
    @deck = Deck.find(params[:id])
    if user_signed_in? && current_user.id == @deck.user.id
      respond_to do |format|
        if @deck.update_attributes(deck_params)
          format.json { render json: @deck }
        else
          format.json { render json: @deck.errors.messages, status: :precondition_failed }
        end
      end
    else
      head :forbidden
    end
  end
  
  def deck_params
    params.require(:deck).permit(:name, :description)
  end
end