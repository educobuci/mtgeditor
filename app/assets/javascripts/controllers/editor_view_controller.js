(function(){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  
  window.EditorViewController = function constructor(){
    this.init();
  };
  
  window.EditorViewController.prototype.init = function(){
    this.searchListView = $("#search-listview").listView({
      delegate: this
    });
    
    this.searchField = $("#search-field");
    
    this.doBindings();
    
    window.CardsProvider.preFetch(function(){ console.log("Cards fetch done.")});
  };
  
  window.EditorViewController.prototype.doBindings = function(){
    var self = this;
    
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
  
  var editorViewController = new EditorViewController();
  
  // cardsLoader.fetch(function(cards){
  //   window.cardsArray = cards;
  //
  //   $('input.search-text').keydown(function(e){
  //     if (event.which === UP_KEY || event.which === DOWN_KEY)
  //     {
  //       var grid = $(".grid-list").first();
  //       event.preventDefault();
  //       var fakeEvent = jQuery.Event("keydown");
  //       fakeEvent.which = event.which;
  //       grid.trigger(fakeEvent);
  //     }
  //   });
  //
  //   $("input.search-text").keyup(function(event){
  //     var grid = $("div.grid-list ul").first();
  //
  //     if (event.which !== UP_KEY && event.which !== DOWN_KEY)
  //     {
  //       var searchText = $(this).val().toLowerCase();
  //
  //       var grid = $("div.grid-list ul").first();
  //       grid.empty();
  //
  //       if (searchText.length > 1) {
  //         var result = window.cardsArray.filter(function(card){
  //           return card.search.indexOf(searchText) > -1;
  //         });
  //         result.slice(0,100).forEach(function(card){
  //           grid.append($("<li class=\"\">").text(card.name));
  //         })
  //       }
  //     }
  //   });
  // });
}());