var design = {

    // Höhe vom Main_Content berechnen
    setMainContentHeight: function() {
        var editFieldHeight = this.replacePX('#edit_field','height');
        var colRightHeight = this.replacePX('#column_right','height');
        var colRightPaddingTop = this.replacePX('#column_right','padding-top');
        var colRightPaddingBottom = this.replacePX('#column_right','padding-bottom');
        var editFieldLineHeight = this.replacePX('.edit_field > div > div','line-height');
        var mainContentHeight = colRightHeight - editFieldHeight - editFieldLineHeight;
        $("#main_content").css("max-height", mainContentHeight);

    },

    // Breite der Right_Column berechnen
    setRightColumnWidth: function() {
        var navLeftWidth = this.replacePX('#left_nav','width');
        var bodyWidth = this.replacePX('body','width');
        var colLeftPaddingLeft = this.replacePX('#column_left','padding-left');
        var colRightWidth = bodyWidth - navLeftWidth - colLeftPaddingLeft - 10;
        $("#column_right").css("width", colRightWidth);
    },

    setSize: function(){
        this.setMainContentHeight();
        this.setRightColumnWidth();
        this.scrollTableTop();
    },
    
    // Macht aus dem String eine Zahl	
    replacePX: function(id,cssValue) {
        return(($(id).css(cssValue)).replace('px','')*1);
    },

 //  Scrollposition der Tabelle nach oben setzen
    scrollTableTop: function(){
        $("#main_content").scrollTop(0);
    },

}