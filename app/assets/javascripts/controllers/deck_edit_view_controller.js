(function(){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  var RETURN_KEY = 13;
  
  var BACKSPACE_KEY = 8;
  var DELETE_KEY = 46;
  var MINUS_KEY = 189;
  var PLUS_KEY = 187; // Also "=" key 
  
  window.DeckEditViewController = function constructor(){
    this.init();
  };
  
  window.DeckEditViewController.prototype.init = function(){
    var self = this;
    
    if ($("#list-item-template").html()) {
      this.listItemTemplate = Handlebars.compile($("#list-item-template").html());
    }
    
    this.inSync = false;
    
    // Setup search list view
    this.searchListView = $("#search-listview").listView({
      delegate: {
        numberOfRowsInSection: self.searchNumberOfRows.bind(self),
        cellForRowAtIndexPath: self.searchCellForRowAtIndexPath.bind(self),
        didSelectRowAtIndexPath: self.searchDidSelectRowAtIndexPath.bind(self),
        numberOfSections: self.searchNumberOfSections.bind(self),
        viewForHeaderInSection: self.searchViewForHeaderInSection.bind(self)
      },
      rootSelector: "ul"
    });
    
    // Setup deck list view
    this.deckListView = $("#deck-listview").listView({
      delegate: {
        numberOfRowsInSection: self.deckNumberOfRows.bind(self),
        cellForRowAtIndexPath: self.deckCellForRowAtIndexPath.bind(self),
        didSelectRowAtIndexPath: self.deckDidSelectRowAtIndexPath.bind(self),
        numberOfSections: self.deckNumberOfSections.bind(self),
        viewForHeaderInSection: self.deckViewForHeaderInSection.bind(self)
      },
      rootSelector: "ul"
    });
    
    // Set list views data
    this.searchResultData = [];
    this.deckData = [];
    
    // Create the element references
    this.searchField = $("#search-field");
    this.cardImage = $("#card-image img");
    this.cardText = $("#card-text textarea");
    this.deckForm = $("#deck-form");
    
    // Load current deck info
    var regexp = new RegExp(/\d+/);
    var result = regexp.exec(this.deckForm.attr("action"));
    this.currentDeck = null;
    if (result) {
      this.currentDeck = parseInt(result, 10);
    }    
    
    this.searchField.focus();
    
    this.bind();
    
    window.CardsProvider.preFetch(function(){
      console.log("Cards fetch done.");
      this.loadDeck();
    }.bind(this));
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
      if (event.which !== UP_KEY && event.which !== DOWN_KEY && event.which !== RETURN_KEY)
      {
        var searchText = $(this).val().toLowerCase();
        if (searchText.length > 1) {
          window.CardsProvider.search(searchText, function(cards){
            if (self.searchResultData.length != cards.length) {
              self.searchResultData = cards;
              self.searchListView.listView("reloadData");
            }
          }.bind(self));
        }
      }
    });
    
    this.searchListView.on("dblclick", "li", function(event){
      self.addCardToDeck(self.searchResultData[$(this).index()]);
    });
    
    this.searchListView.keydown(function(event){
      if (event.which === RETURN_KEY || event.which === PLUS_KEY) {
        self.addCardToDeck(self.searchResultData[self.searchListView.listView("indexForSelectedRow")]);
      }
    });
    
    this.deckListView.keydown(function(event){
      var index = self.deckListView.listView("indexForSelectedRow");
      if (index > -1) {
        if(event.which === BACKSPACE_KEY || event.which === DELETE_KEY || event.which === MINUS_KEY){
          var card = self.deckData[index];
          card.count--;
          
          if (!self.deckData[index].count) {
            self.deckData.splice(index,1);
          }
          
          self.syncCard(card);
        }
        else if (event.which === PLUS_KEY) {
          self.addCardToDeck(self.deckData[index]);
        }
      }
    });
    
    this.deckForm.on("ajax:success", function(e, data, status, xhr)
    {
      if (document.URL.indexOf("/edit") < 0) {
        history.pushState(null, null, "/decks/" + data.id + "/edit");
        self.deckForm.attr("action", "/decks/" + data.id);
        self.deckForm.append('<input type="hidden" name="_method" value="patch">');
        self.syncCard(self.deckData);
      }
    }).on("ajax:error", function(e, data, status, xhr)
    {
      alert("error");
    });
  };
  
  // Add a card to deck
  window.DeckEditViewController.prototype.addCardToDeck = function(card) {
    if (card) {
      var deckCard = card.muid ? card : this.convertToDeckCard(card);
      var filter = this.deckData.filter(function(c){
        return c.name === deckCard.name;
      });
    
      if (filter.length) {
        deckCard = filter[0];
        deckCard.count++;
      }
      else
      {        
        this.deckData.push(deckCard);
      }
      this.deckListView.listView("reloadData");
      this.syncCard(deckCard);
    }
  }
  
  window.DeckEditViewController.prototype.convertToDeckCard = function(card)
  {
    var cardSet = card.set.length ? card.set[card.set.length -1] : card.set;
    return {
      id: null,
      name: card.name,
      count: 1,
      set: cardSet["#text"],
      muid: cardSet["-muId"],
      mainboard: true,
      condition: 0,
      foil: false
    }
  }
  
  window.DeckEditViewController.prototype.syncCard = function(cards){
    var formAction = this.deckForm.attr("action");
    var regexp = new RegExp(/\d+/);
    var result = regexp.exec(formAction);
    
    if (!cards.length) {
      cards = [cards];
    }
    
    if (result) {
      var deckId = result[0];
      var formData = "cards=" + JSON.stringify(cards);
      $.post(formAction + "/deck_cards", formData, function(data){
        this.deckData = data;
        this.deckListView.listView("reloadData");
      }.bind(this));
    }
  }
  
  // Search list view delegate methods
  window.DeckEditViewController.prototype.searchNumberOfRows = function(){
    return this.searchResultData.length;
  };
  
  window.DeckEditViewController.prototype.searchCellForRowAtIndexPath = function(index){
    var card = this.searchResultData[index];
    return $(this.listItemTemplate(card)).get(0);
  };
  
  window.DeckEditViewController.prototype.searchDidSelectRowAtIndexPath = function(index){
    var card = this.searchResultData[index];
    this.showCardDetails(card);
  };
  
  window.DeckEditViewController.prototype.searchNumberOfSections = function(index){
    return 1;
  };
  
  window.DeckEditViewController.prototype.searchViewForHeaderInSection = function(index){
    return null;
  };
  
  // Deck list view delegate methods
  window.DeckEditViewController.prototype.deckNumberOfRows = function(){
    return this.deckData.length;
  };
  
  window.DeckEditViewController.prototype.deckCellForRowAtIndexPath = function(index){
    var card = this.deckData[index];
    return $(this.listItemTemplate(card)).get(0);
  };
  
  window.DeckEditViewController.prototype.deckDidSelectRowAtIndexPath = function(index){
    var card = this.deckData[index];
    this.showCardDetails(card);
  };
  
  window.DeckEditViewController.prototype.deckNumberOfSections = function(index){
    return 1;
  };
  
  window.DeckEditViewController.prototype.deckViewForHeaderInSection = function(index){
    return $("<li>").css({background: "gray", color: "white", padding: "2px 5px"}).text("Creatures").get(0);
  };
  
  // Show card details
  window.DeckEditViewController.prototype.showCardDetails = function(card) {
    var imageUrl = "http://gatherer.wizards.com/Handlers/Image.ashx?name=" + card.name + "&type=card&.jpg";

    this.cardImage.attr("src", imageUrl);
    if (!card.text) {
      window.CardsProvider.findByMUID(card.muid, function(setCard){
        this.cardText.val(setCard.text);
      }.bind(this));
    }
    else {
      this.cardText.val(card.text);
    }
  }
  
  window.DeckEditViewController.prototype.loadDeck = function(callback) {
    if (this.currentDeck) {
      $.get(this.deckForm.attr("action") + "/deck_cards.json", function(data)
      {
        this.deckData = data;
        this.deckListView.listView("reloadData");
      }.bind(this));
    }
  }
  
  var deckEditViewController = new DeckEditViewController();
}());