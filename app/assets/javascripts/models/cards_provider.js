(function(){
  window.CardsProvider = {
    search: function(term, callback) {
      callback(window.CardsProvider._searchInArray(term, window.CardsProvider.cardsArray));
    },
    
    preFetch: function(callback)
    {
      window.CardsProvider._getAll(callback);
    },
    
    findByMUID: function(muid, callback)
    {
      var result = window.CardsProvider.cardsArray.filter(function(card){
        if (card.set.length) {
          var cardSet = card.set.filter(function(set){
            return set["-muId"] == muid;
          });
          return cardSet && cardSet.length > 0;
        }
        else
        {
          return card.set["-muId"] == muid;
        }
      });
      
      callback(result[0]);
    },
    
    _searchInArray:function(term, array){
      var result = array.filter(function(card){
        return card.search.indexOf(term) > -1;
      });
      return result.slice(0, 100);
    },
    
    _getAll: function(callback){
      if(!window.CardsProvider.cardsArray){
        $.get("http://s3.amazonaws.com/mtgeditor/cards.min.json.gz", function(data){
          var cardsArray = data.cockatrice_carddatabase.cards.card.sort(function(a,b){
            return a.name.localeCompare(b.name);
          });
          cardsArray.forEach(function(card){
            card.search = (card.name || "").toLowerCase(); // + " " + (card.text || "").toLowerCase(); 
          });
        
          window.CardsProvider.cardsArray = cardsArray;
          callback(cardsArray);
        }).error(function(error){
          throw error;
        });
      }
      else {
        callback(window.CardsProvider.cardsArray);
      }
    }
  };
}());