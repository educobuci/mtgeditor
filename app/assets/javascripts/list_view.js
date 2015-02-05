(function(){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  
  $.widget( "custom.listView", {
    _state: {
      isMouseDown: false
    },

    _create: function(options) {    
      this._settings = $.extend({
        tag: "li",
        selectedClass: "selected",
        selectedSelector: ".selected"
      }, options );

      this._bind();
    },
  
    // Bind events
    _bind: function()
    {
      var plugin = this;
    
      // Grid item mouse over event
      this.element.on("mouseover", this._settings.tag, function(event){
        if (plugin.element.is(":focus") && plugin._state.isMouseDown) {
          plugin.element.find(plugin._settings.selectedSelector).removeClass(plugin._settings.selectedClass);
          $(this).addClass(plugin._settings.selectedClass);
        }
      });
    
      // Grid item mouse over event
      this.element.on("mousedown", this._settings.tag, function(event){
        plugin.element.find(plugin._settings.selectedSelector).removeClass(plugin._settings.selectedClass);
        $(this).addClass(plugin._settings.selectedClass);
      });
    
      // Grid mouse down event
      this.element.mousedown(function(event){
        $(this).focus();
        event.preventDefault();
        plugin._state.isMouseDown = true;
      });
    
      // Grid mouse up event
      this.element.mouseup(function(){
        plugin._state.isMouseDown = false;
      });
    
      // Global mouse up event
      $(document).mouseup(function(){
        if(plugin._state.isMouseDown)
        {
          plugin._state.isMouseDown = false;
        }
      });
    
      // Grid up/down arrow keyboard events
      this.element.keydown(function( event, custom ) {
        if (event.which === UP_KEY || event.which === DOWN_KEY && this.find(plugin._settings.tag).length > 0) {
          event.preventDefault();
        
          var selectedElement = null;
        
          if (this.find(plugin._settings.selectedSelector).length === 0) {
            selectedElement = this.find(plugin._settings.tag)[0];
          }
          else if (event.which === DOWN_KEY) {
            selectedElement = this.find(plugin._settings.selectedSelector).next();
          }
          else if (event.which === UP_KEY) {
            selectedElement = this.find(plugin._settings.selectedSelector).prev();
          }
        
          if (selectedElement.length === 0) {
            this.find(plugin._settings.selectedSelector)
          }
          else
          {
            this.find(plugin._settings.selectedSelector).removeClass(plugin._settings.selectedClass);
          }
        
          $(selectedElement).addClass(plugin._settings.selectedClass);
        }
      }.bind(this.element));
    }
  });
}());
