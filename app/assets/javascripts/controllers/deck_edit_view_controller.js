(function(){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  
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
    
    this.searchField = $("#search-field");
    this.cardImage = $("#card-image img");
    this.cardText = $("#card-text textarea");
    
    this.searchField.focus();
    
    this.bind();
    
    window.CardsProvider.preFetch(function(){ console.log("Cards fetch done.")});
  };
  
  window.DeckEditViewController.prototype.bind = function(){
    var self = this;
    
    this.searchField.keydown(function(event){
      if (event.which === UP_KEY || event.which === DOWN_KEY)
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
      console.dir(this);
    });
  };
  
  // Search ListView delegate methods
  window.DeckEditViewController.prototype.searchNumberOfRows = function(){
    return this.searchResultData.length;
  };
  
  window.DeckEditViewController.prototype.searchCellForRowAtIndex = function(index){
    var card = this.searchResultData[index];
    return $("<li>").text(card.name).get(0);
  };
  
  window.DeckEditViewController.prototype.searchDidSelectRowAtIndex = function(index){
    var card = this.searchResultData[index];
    var imageUrl = card.set["-picURL"] || "http://gatherer.wizards.com/Handlers/Image.ashx?name=" + card.name + "&type=card&.jpg";

    this.cardImage.attr("src", imageUrl);
    this.cardText.val(card.text);
  };
  
  var deckEditViewController = new DeckEditViewController();
}());