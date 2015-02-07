(function(){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  
  window.DeckEditViewController = function constructor(){
    this.init();
  };
  
  window.DeckEditViewController.prototype.init = function(){
    this.searchListView = $("#search-listview").listView({
      delegate: this,
      rootSelector: "ul"
    });
    
    this.searchField = $("#search-field");
    
    this.cardImage = $("#card-image img");
    
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
  };
  
  // Search ListView delegate methods
  window.DeckEditViewController.prototype.numberOfRows = function(){
    return this.searchResultData.length;
  };
  
  window.DeckEditViewController.prototype.cellForRowAtIndex = function(index){
    var card = this.searchResultData[index];
    return $("<li>").text(card.name).get(0);
  };
  
  window.DeckEditViewController.prototype.didSelectRowAtIndex = function(index){
    var card = this.searchResultData[index];
    var muId = "";
    if (card.set.length) {
      var sets = card.set.sort(function(a,b){
        return parseInt(a["-muId"],10) - parseInt(b["-muId"], 10);
      });
      console.log(sets);
      muId = sets[sets.length - 1]["-muId"];
    }
    else
    {
      muId = card.set["-muId"];
    }
    
    var imageUrl = card.set["-picURL"] || "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + muId +  "&type=card";
    
    this.cardImage.attr("src", imageUrl);
  };
  
  var deckEditViewController = new DeckEditViewController();
}());