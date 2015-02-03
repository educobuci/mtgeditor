(function(){
  window.cardsLoader = {
    fetchJson: function(callback){
      $.get("http://s3.amazonaws.com/mtgeditor/cards.json", function(data){
        window.databse = data;
        window.cardsArray = databse.cockatrice_carddatabase.cards.card;
        callback();
      }).error(function(e){
        console.dir(e);
      });
    }
  };
}());