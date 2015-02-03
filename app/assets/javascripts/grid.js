(function($){
  // Constants definition
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  var SELECTED_CLASS = "selected";
  var SELECTED_SELECTOR = "." + SELECTED_CLASS;
  
  // Grid Plugin definition
  $.fn.grid = function(options){
    
    // References
    var plugin = $.fn.grid;
    var $element = this;
    
    // Settings
    var settings = $.extend({
      tag: "li",
    }, options );
    
    // Grid item mouse over event
    this.on("mouseover", settings.tag, function(event){
      if ($element.is(":focus") && plugin.isMouseDown === 1) {
        $element.find(SELECTED_SELECTOR).removeClass(SELECTED_CLASS);
        $(this).addClass(SELECTED_CLASS);
      }
    });
    
    // Grid item mouse over event
    this.on("mousedown", settings.tag, function(event){
      console.log("mouse down");
      $element.find(SELECTED_SELECTOR).removeClass(SELECTED_CLASS);
      $(this).addClass(SELECTED_CLASS);
    });
    
    // Grid mouse down state control
    if (typeof(plugin.isMouseDown)==="undefined") {
      plugin.isMouseDown = 0;
    }
    
    // Grid mouse down event
    this.mousedown(function(event){
      $(this).focus();
      event.preventDefault();
      ++plugin.isMouseDown;
    });
    
    // Grid mouse up event
    this.mouseup(function(){
      plugin.isMouseDown = 0;
    });
    
    // Global mouse up event
    $("body").mouseup(function(){
      if(plugin.isMouseDown)
      {
        plugin.isMouseDown = 0;
      }      
    });
    
    // Grid up/down arrow keyboard events
    this.keydown(function( event, custom ) {
      console.log("ronaaaaaado", custom, this.find(settings.tag))
      if (event.which === UP_KEY || event.which === DOWN_KEY && this.find(settings.tag).length > 0) {
        event.preventDefault();
        
        var selectedElement = null;
        
        if (this.find(SELECTED_SELECTOR).length === 0) {
          selectedElement = this.find(settings.tag)[0];
        }
        else if (event.which === DOWN_KEY) {
          selectedElement = this.find(SELECTED_SELECTOR).next();
        }
        else if (event.which === UP_KEY) {
          selectedElement = this.find(SELECTED_SELECTOR).prev();
        }
        
        if (selectedElement.length === 0) {
          this.find(SELECTED_SELECTOR)
        }
        else
        {
          this.find(SELECTED_SELECTOR).removeClass(SELECTED_CLASS);
        }
        
        $(selectedElement).addClass(SELECTED_CLASS);
      }
    }.bind(this));
  };
  
}(jQuery));