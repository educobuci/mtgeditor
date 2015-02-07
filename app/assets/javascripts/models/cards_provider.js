(function(){
  window.CardsProvider = {
    search: function(term, callback) {
      if(!window.CardsProvider.cardsArray)
      {
        window.CardsProvider._getAll(function(cards){
          window.CardsProvider.cardsArray = cards;
          callback(window.CardsProvider._searchInArray(term, window.CardsProvider.cardsArray));
        });
      }
      else
      {
        callback(window.CardsProvider._searchInArray(term, window.CardsProvider.cardsArray));
      }
    },
    
    preFetch: function(callback)
    {
      window.CardsProvider._getAll(callback);
    },
    
    _searchInArray:function(term, array){
      var result = array.filter(function(card){
        return card.search.indexOf(term) > -1;
      });
      return result.slice(0, 100);
    },
    
    _getAll: function(callback){
      $.get("http://s3.amazonaws.com/mtgeditor/cards.min.json", function(data){
        var cardsArray = data.cockatrice_carddatabase.cards.card.sort(function(a,b){
          return a.name.localeCompare(b.name);
        });
        cardsArray.forEach(function(card){
          card.search = (card.name || "").toLowerCase() + " " + (card.text || "").toLowerCase(); 
        });
        
        callback(cardsArray);
      }).error(function(error){
        throw error;
      });
    }
  };
}());