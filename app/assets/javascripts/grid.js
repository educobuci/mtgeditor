(function($){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  var SELECTED_CLASS = "selected";
  
  $.fn.grid = function(options){
    var settings = $.extend({
      tag: "li",
    }, options );
            
    this.keydown(function( event ) {
      if (event.which === UP_KEY || event.which === DOWN_KEY && this.find(settings.tag).length > 0) {
        var selectedElement = null;
        
        if (this.find("." + SELECTED_CLASS).length === 0) {
          selectedElement = this.find(settings.tag)[0];
        }
        else if (event.which === DOWN_KEY) {
          selectedElement = this.find("." + SELECTED_CLASS).next();
        }
        else if (event.which === UP_KEY) {
          selectedElement = this.find("." + SELECTED_CLASS).prev();
        }
        
        if (selectedElement.length === 0) {
          this.find("." + SELECTED_CLASS)
        }
        else
        {
          this.find("." + SELECTED_CLASS).removeClass(SELECTED_CLASS);
        }
        
        
        $(selectedElement).addClass(SELECTED_CLASS);
      }
    }.bind(this));
  };
  
}(jQuery));