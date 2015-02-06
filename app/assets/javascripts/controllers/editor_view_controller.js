(function(){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  
  window.EditorViewController = function constructor(){
    this.init();
  };
  
  window.EditorViewController.prototype.init = function(){
    this.searchListView = $("#search-listview").listView({
      delegate: this,
      rootSelector: "ul"
    });
    
    this.searchField = $("#search-field");
    
    this.bind();
    
    window.CardsProvider.preFetch(function(){ console.log("Cards fetch done.")});
  };
  
  window.EditorViewController.prototype.bind = function(){
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
  window.EditorViewController.prototype.numberOfRows = function(){
    return this.searchResultData.length;
  };
  
  window.EditorViewController.prototype.cellForRowAtIndex = function(index){
    var card = this.searchResultData[index];
    return $("<li class=\"\">").text(card.name).get(0);
  };
  
  var editorViewController = new EditorViewController();
}());