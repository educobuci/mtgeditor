$.widget( "custom.listView", {
  _state: {
    mouseDown: false
  },

  _create: function(options) {
    console.log("on create");
    
    this._settings = $.extend({
      tag: "li",
      selectedClass: "selected",
      selectedSelector: ".selected"
    }, options );
    
    this._bind();
  },
  
  _bind: function()
  {
    var plugin = this;
    
    this.element.on("mouseover", this._settings.tag, function(event){
      if (plugin.element.is(":focus") && plugin._state.isMouseDown === 1) {
        plugin.element.find(plugin._settings.selectedSelector).removeClass(plugin._settings.selectedClass);
        $(this).addClass(plugin._settings.selectedClass);
      }
    });
    
    this.element.on("mousedown", this._settings.tag, function(event){
      plugin.element.find(plugin._settings.selectedSelector).removeClass(plugin._settings.selectedClass);
      $(this).addClass(plugin._settings.selectedClass);
    });
  }
});