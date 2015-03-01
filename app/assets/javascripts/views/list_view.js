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
          if (!plugin.isSectionElement(this)) {
            plugin.element.find(plugin.options.selectedSelector).removeClass(plugin.options.selectedClass);
            plugin.selectRow(this);
          }
        }
      });
    
      // Grid item mouse over event
      this.element.on("mousedown", this.options.tag, function(event){
        if (!plugin.isSectionElement(this)) {
          plugin.element.find(plugin.options.selectedSelector).removeClass(plugin.options.selectedClass);
          plugin.selectRow(this);
        }
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
            selectedElement = $(this.find(plugin.options.tag).get(0));
          }
          else if (event.which === DOWN_KEY) {
            selectedElement = this.find(plugin.options.selectedSelector).next();
            if(plugin.isSectionElement(selectedElement)) {
              selectedElement = selectedElement.next();
            }
          }
          else if (event.which === UP_KEY) {
            selectedElement = this.find(plugin.options.selectedSelector).prev();
            if(plugin.isSectionElement(selectedElement)) {
              selectedElement = selectedElement.prev();
            }
          }
        
          if (selectedElement.length === 0) {
            this.find(plugin.options.selectedSelector);
          }
          else
          {
            this.find(plugin.options.selectedSelector).removeClass(plugin.options.selectedClass);
          }
          
          if (selectedElement.length) {
            plugin.selectRow(selectedElement.get(0));
          }          
        }
      }.bind(this.element));
    },
    
    selectRow: function(element, silence){
      $(element).addClass(this.options.selectedClass);
      if (this.options.delegate.didSelectRowAtIndexPath && !silence) {
      
        var absoluteIndex = $(element).index();
        var indexPath = this.indexPathOfAbsoluteIndex(absoluteIndex);
      
        console.log(absoluteIndex, JSON.stringify(indexPath));
      
        if (indexPath.section >= 0) {
          this.options.delegate.didSelectRowAtIndexPath(indexPath);
        }
      }    
    },
    
    //Public methods
    reloadData: function(){
      var numberOfSections = this.options.delegate.numberOfSections();
      var rootElement = this.options.rootSelector ? this.element.find(this.options.rootSelector) : this.element;
      var selectedRow = Math.max(0, this.element.find(this.options.selectedSelector).index());
      var selectedHtml = $(rootElement.find(this.options.tag).get(selectedRow));
      rootElement.empty();
      var fragment = document.createDocumentFragment();
      
      for (var i = 0; i < numberOfSections; i++) {
        var rowCount = this.options.delegate.numberOfRowsInSection(i);
        var sectionView = this.options.delegate.viewForHeaderInSection(i);
        if (sectionView) {
          fragment.appendChild(sectionView);
        }
        for (var j = 0; j < rowCount; j++) {
          fragment.appendChild(this.options.delegate.cellForRowAtIndexPath({row: j, section: i}));
        }
      }
      
      rootElement.append(fragment);
      
      var newSelectedHtml = $(rootElement.find(this.options.tag).get(selectedRow));
      
      if (selectedRow < rowCount) {
        var selectedChanged = (!selectedHtml || (selectedHtml.html() !== newSelectedHtml.html()));
        this.selectRow(rootElement.find(this.options.tag).get(selectedRow), !selectedChanged);
      }
    },
    
    indexPathForSelectedRow: function()
    {
      return this.indexPathOfAbsoluteIndex(this.element.find(this.options.selectedSelector).index());
    },
    
    indexPathOfAbsoluteIndex: function(absoluteIndex)
    {
      var numberOfSections = this.options.delegate.numberOfSections();
      var sectionsBefore = 0;
      var offset = 0;
      
      for (var i = 0; i < numberOfSections && offset + i < absoluteIndex; i++, sectionsBefore++)
      {
        offset += this.options.delegate.numberOfRowsInSection(i);
      }
      
      var section = sectionsBefore -1;
      
      offset = offset + section;
      
      var row = this.options.delegate.numberOfRowsInSection(section) - (offset - absoluteIndex) - 1;
      var indexPath = {section: section, row: row};
      return indexPath;
    },
    
    isSectionElement: function(element){
      var selectedIndexPath = this.indexPathOfAbsoluteIndex($(element).index());
      var numberOfRowsInSection = this.options.delegate.numberOfRowsInSection(selectedIndexPath.section +1);
      return selectedIndexPath.row === numberOfRowsInSection;
    }
  })
}());
