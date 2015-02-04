(function(){
  window.cardsLoader = {
    fetch: function(callback){
      $.get("http://s3.amazonaws.com/mtgeditor/cards.gz.json", function(data){
        var cardsArray = data.cockatrice_carddatabase.cards.card.sort(function(a,b){
          return a.name.localeCompare(b.name);
        });
        cardsArray.forEach(function(card){
          card.search = card.name.toLowerCase() + " " + card.text.toLowerCase(); 
        });
        
        callback(cardsArray);
      }).error(function(e){
        throw e;
      });
    }
  };
}());