// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
(function(){
  $(".grid-list").each(function(){
    $(this).grid();
  });
  cardsLoader.fetch(function(cards){
    window.cardsArray = cards;
    
    console.log("Loading complete.");
    
    var UP_KEY = 38;
    var DOWN_KEY = 40;
    
    $('input.search-text').keydown(function(e){
      if (event.which === UP_KEY || event.which === DOWN_KEY)
      {
        var grid = $(".grid-list").first();
        event.preventDefault();
        var fakeEvent = jQuery.Event("keydown");
        fakeEvent.which = event.which;
        grid.trigger(fakeEvent);
      }
    });
    
    $("input.search-text").keyup(function(event){
      var grid = $("div.grid-list ul").first();
      
      if (event.which !== UP_KEY && event.which !== DOWN_KEY)
      {
        var searchText = $(this).val().toLowerCase();
    
        var grid = $("div.grid-list ul").first();
        grid.empty();
    
        if (searchText.length > 1) {  
          var result = window.cardsArray.filter(function(card){
            return card.search.indexOf(searchText) > -1;
          });        
          result.slice(0,100).forEach(function(card){
            grid.append($("<li class=\"\">").text(card.name));
          })
        }
      }
    });
    
  });
  window.render
})();

function bench(clojure)
{
  var time = Date.now();
  clojure();
  console.info("Time elipsed(ms): ", Date.now() - time);
}