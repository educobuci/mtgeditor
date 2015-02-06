(function(){
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  
  $.widget( "custom.listView", {
    options: {
      tag: "li",
      selectedClass: "selected",
      selectedSelector: ".selected"
    },
    
    _state: {
      isMouseDown: false
    },

    _create: function(options) {
      this._bind();
    },
  
    // Bind events
    _bind: function() {
      var plugin = this;
    
      // Grid item mouse over event
      this.element.on("mouseover", this.options.tag, function(event){
        if (plugin.element.is(":focus") && plugin._state.isMouseDown) {
          plugin.element.find(plugin.options.selectedSelector).removeClass(plugin.options.selectedClass);
          $(this).addClass(plugin.options.selectedClass);
        }
      });
    
      // Grid item mouse over event
      this.element.on("mousedown", this.options.tag, function(event){
        plugin.element.find(plugin.options.selectedSelector).removeClass(plugin.options.selectedClass);
        $(this).addClass(plugin.options.selectedClass);
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
        if (event.which === UP_KEY || event.which === DOWN_KEY && this.find(plugin.options.tag).length > 0) {
          event.preventDefault();
        
          var selectedElement = null;
        
          if (this.find(plugin.options.selectedSelector).length === 0) {
            selectedElement = this.find(plugin.options.tag)[0];
          }
          else if (event.which === DOWN_KEY) {
            selectedElement = this.find(plugin.options.selectedSelector).next();
          }
          else if (event.which === UP_KEY) {
            selectedElement = this.find(plugin.options.selectedSelector).prev();
          }
        
          if (selectedElement.length === 0) {
            this.find(plugin.options.selectedSelector)
          }
          else
          {
            this.find(plugin.options.selectedSelector).removeClass(plugin.options.selectedClass);
          }
        
          $(selectedElement).addClass(plugin.options.selectedClass);
        }
      }.bind(this.element));
    },
    
    //Public methods
    reloadData: function(){
      var rowCount = this.options.delegate.numberOfRows();
      var rootElement = this.options.rootSelector ? this.element.find(this.options.rootSelector) : this.element;
      
      rootElement.empty();
      
      var fragment = document.createDocumentFragment();
      
      for (var i = 0; i < rowCount; i++) {
        fragment.appendChild(this.options.delegate.cellForRowAtIndex(i));
      }
      
      rootElement.append(fragment);
    }
  })
}());
