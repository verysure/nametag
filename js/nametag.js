

// Create nametag plugins
(function(API){
    var initialX = 0.2;
    var initialY = 0.2;
    var default_spacing = 0.05;
    API.x = initialX;
    API.y = initialY;

    // center text plugin
    API.centerText = function(txt, x, y, fontsize, style) {
        if (fontsize) {
            this.setFontSize(fontsize);
        }
        if (style) {
            this.setFontStyle(style);
        } else {
            this.setFontStyle('normal');
        }
        // get txt width
        var w = this.getStringUnitWidth(txt) * this.internal.getFontSize() / this.internal.scaleFactor;
        var h = this.getTextDimensions(txt).h  / this.internal.scaleFactor;

        // Draw text at x,y
        this.text(txt, x - w/2, y);
    };



    API.createNametag = function(name, affiliation, config) {
        config = config || {};

        // Draw Tag and update xy if out-of-bounds
        config.linewidth = config.linewidth || 0.02;
        config.width = config.width || 4;
        config.height = config.height || 3;
        if (this.x+config.width >= this.internal.pageSize.width) {
            this.x = initialX;
            this.y = this.y + config.height + default_spacing;
        }
        if (this.y + config.height >= this.internal.pageSize.height) {
            this.addPage()
            this.y = initialY;
        }

        this.setLineWidth(config.linewidth);
        this.rect(this.x, this.y, config.width, config.height);

        // Output Texts: Adjust for overflow lines
        var adjust_height = 0;
        config.namesize = config.namesize || 25;
        config.affsize = config.affsize || 15;
        this.setFontSize(config.namesize);
        var nameheight = this.getTextDimensions('a').h / this.internal.scaleFactor;
        var text_list = this.splitTextToSize(name, config.width*0.9).map(function (text){
            adjust_height += nameheight;
            return [text, nameheight, config.namesize, 'bold'];
        });
        this.setFontSize(config.affsize);
        var affheight = this.getTextDimensions('a').h / this.internal.scaleFactor;
        text_list = text_list.concat(this.splitTextToSize(affiliation, config.width*0.9).map(function(text){
            adjust_height += affheight;
            return [text, affheight, config.affsize, 'italic'];
        }));


        adjust_height = adjust_height/2;
        for (var i = 0; i < text_list.length; i++) {
            adjust_height -= text_list[i][1];
            this.centerText(
                text_list[i][0],
                this.x + config.width/2,
                this.y + config.height/2 - adjust_height,
                text_list[i][2],
                text_list[i][3]
            );
        }



        // Output a logo
        config.position = config.position || 'br';
        config.logo = config.logo || "0";

        var logox, logoy;
        if (config.position[0] === 't') {
            logoy = this.y + 0.02;
        } else {
            logoy = this.y + config.height - 0.02 - 0.6;
        }
        if (config.position[1] === 'l') {
            logox = this.x + 0.02;
        } else {
            logox = this.x + config.width - 0.02 - 0.9;
        }

        this.addImage(config.logo, 'JPEG', logox, logoy, 0.9,0.6);

        // Update x,y coordinate
        this.x = this.x + config.width + default_spacing;

    };






})(jsPDF.API);
