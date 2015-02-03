(function(){
  window.cardsLoader = {
    fetchJson: function(callback){
      $.get("http://s3.amazonaws.com/mtgeditor/cards.gz.json", function(data){
        window.databse = data;
        window.cardsArray = databse.cockatrice_carddatabase.cards.card.sort(function(a,b){
          return a.name.localeCompare(b.name);
        });
        callback();
      }).error(function(e){
        console.dir(e);
      });
    }
  };
}());