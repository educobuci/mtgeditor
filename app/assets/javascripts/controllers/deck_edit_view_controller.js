(function(){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  var RETURN_KEY = 13;
  
  window.DeckEditViewController = function constructor(){
    this.init();
  };
  
  window.DeckEditViewController.prototype.init = function(){
    var self = this;
    
    // Setup search list view
    this.searchListView = $("#search-listview").listView({
      delegate: {
        numberOfRows: self.searchNumberOfRows.bind(self),
        cellForRowAtIndex: self.searchCellForRowAtIndex.bind(self),
        didSelectRowAtIndex: self.searchDidSelectRowAtIndex.bind(self),
      },
      rootSelector: "ul"
    });
    
    // Setup deck list view
    this.deckListView = $("#deck-listview").listView({
      delegate: {
        numberOfRows: self.deckNumberOfRows.bind(self),
        cellForRowAtIndex: self.deckCellForRowAtIndex.bind(self),
        didSelectRowAtIndex: self.deckDidSelectRowAtIndex.bind(self),
      },
      rootSelector: "ul"
    });
    
    this.deckData = [];
    
    this.searchField = $("#search-field");
    this.cardImage = $("#card-image img");
    this.cardText = $("#card-text textarea");
    
    this.searchField.focus();
    
    this.bind();
    
    window.CardsProvider.preFetch(function(){ console.log("Cards fetch done.")});
  };
  
  // Bind events
  window.DeckEditViewController.prototype.bind = function(){
    var self = this;
    
    this.searchField.keydown(function(event){
      if (event.which === UP_KEY || event.which === DOWN_KEY || event.which === RETURN_KEY)
      {
        event.preventDefault();
        var virtualEvent = jQuery.Event("keydown");
        virtualEvent.which = event.which;
        $(this.searchListView).trigger(virtualEvent);
      }
    }.bind(this));
    
    this.searchField.keyup(function(event){
      if (event.which !== UP_KEY && event.which !== DOWN_KEY)
      {
        var searchText = $(this).val().toLowerCase();
        if (searchText.length > 1) {
          window.CardsProvider.search(searchText, function(cards){
            self.searchResultData = cards;
            self.searchListView.listView("reloadData");
          }.bind(self));
        }
      }
    });
    
    this.searchListView.on("dblclick", "li", function(event){
      var resultCard = self.searchResultData[$(this).index()];
      var deckCard = jQuery.extend(true, {}, resultCard);
      self.deckData.push(deckCard);
      self.deckListView.listView("reloadData");
    });
    
    this.searchListView.keydown(function(event){
      if (event.which === RETURN_KEY) {
        var resultCard = self.searchResultData[self.searchListView.listView("indexForSelectedRow")];
        var deckCard = jQuery.extend(true, {}, resultCard);
        self.deckData.push(deckCard);
        self.deckListView.listView("reloadData");
      }
    });
  };
  
  // Search list view delegate methods
  window.DeckEditViewController.prototype.searchNumberOfRows = function(){
    return this.searchResultData.length;
  };
  
  window.DeckEditViewController.prototype.searchCellForRowAtIndex = function(index){
    var card = this.searchResultData[index];
    return $("<li>").text(card.name).get(0);
  };
  
  window.DeckEditViewController.prototype.searchDidSelectRowAtIndex = function(index){
    var card = this.searchResultData[index];
    this.showCardDetails(card);
  };
  
  // Deck list view delegate methods
  window.DeckEditViewController.prototype.deckNumberOfRows = function(){
    return this.deckData.length;
  };
  
  window.DeckEditViewController.prototype.deckCellForRowAtIndex = function(index){
    var card = this.deckData[index];
    return $("<li>").text((card.count || 1) + "x " + card.name).get(0);
  };
  
  window.DeckEditViewController.prototype.deckDidSelectRowAtIndex = function(index){
    var card = this.deckData[index];
    this.showCardDetails(card);
  };
  
  // Show card details
  window.DeckEditViewController.prototype.showCardDetails = function(card)
  {
    var imageUrl = card.set["-picURL"] || "http://gatherer.wizards.com/Handlers/Image.ashx?name=" + card.name + "&type=card&.jpg";

    this.cardImage.attr("src", imageUrl);
    this.cardText.val(card.text);
  }
  
  var deckEditViewController = new DeckEditViewController();
}());