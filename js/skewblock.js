(function($) {
var config = {
        'left_pos': 0,
        'skew' : 0,
        'obj' : '',
        'isOpened' : false,
        'linewidth' : 0,
        'linepadding' : 0,
        'waitingAction' : false
};
var methods = {
        init : function(line_width, line_height, line_padding, skew) {
                // define the var we need to be global
                config.skew = skew;
                config.obj = $(this);
                config.linewidth = line_width;
                config.linepadding = line_padding + 30;
                
                // set block properties
                $("#sk").css({
                        "width" : line_width + "px"
                });
                // set all lines properties
                $(".line").each(function (index){
                        $(this).css({
                                "height" : line_height + "px",
                                // "line-height" : line_height + "px",
                                "padding" : "0px " + config.linepadding + "px",
                                "top" : (index * line_height) + "px",
                                "text-indent" : (-(line_width)) + "px"
                        });
                });
                // hide the contents of lines before animate them
                // remove the padding of the line containing the open-close button, so we can view it when the block is closed
                $("#sk_nav").css({
                        "text-indent" : "0px",
                        "padding" : "0px"
                });
                // place the open-close button
                $("#sk_openclose").css({
                        "width" : config.linepadding,
                        "height" : line_height,
                        "left" : (line_width - (config.linepadding)) + "px"
                })
                methods.initPosition($(this), skew);
        },
        initPosition : function(obj, skew){
                config.isOpened = false;
                blockWidth = obj.css("width"),
                blockWidth_num = blockWidth.substr(0, blockWidth.length - 2);
                // set the block height = windows height and hide the block on the left side
                obj.css({
                        "height" : $(window).height(),
                        "left" : "-" + blockWidth
                });
                // re-set the overflow to :auto instead of :none (see hideBlock)
                $('body').css('overflow-x', 'auto');
                // the block shows and is available to open
                obj.transition({
                        'left' : (-blockWidth_num) + (config.linepadding) + "px"
                },600, function(){
                        config.waitingAction = true;
                });
                methods.keepPosition(obj, skew);
        },
        showBlock : function(obj, skew) {
                config.isOpened = true;
                methods.keepPosition(obj, skew);
                // show the block skewed
                obj.transition({
                        "left" : Math.floor(methods.getLeftPos(skew)) + "px",  
                        "skewX" : skew + "deg"
                }, 600, function(){
                        config.waitingAction = true;
                });
                // de-skew the lines with the negative value of the skewed parent block, so they display normally
                // display the lines contents (which appears from left to right with text-indent)
                $(".line").transition({                 
                        "skewX" : -(skew) + "deg",
                        "text-indent" : "0px"
                }, 1000);
                
        },
        hideBlock : function(obj, skew){
                // set the overflow to :none to avoid barscroll display (when the block overides windows width). 
                $('body').css('overflow-x' , 'hidden');
                // deskew the lines
                $(".line").transition({                 
                        "skewX" : 0 + "deg" 
                }, 600, function(){    
                })
                // deskew and move out the block to the right
                obj.transition({
                        "left" : $(window).width() + "px",  
                        "skewX" : 0 + "deg"
                }, 600, function(){
                        methods.initPosition(obj, skew)
                });

        },
        getLeftPos : function(skew) {                        
                // Pythagore helps to find the correct left position depending on window height and deg of the skewed block.
                // It prevents the skewed block from moving when user resize the window
                // (a skewed block don't keep his origin position at top:0, left:0 when resizing the browser window)
                var angle = 180 - (skew + 90);
                var radians = angle * Math.PI / 180;
                var tanAngle = Math.abs(Math.tan(radians));
                var left_pos = Math.floor( ($(window).height() / tanAngle ) / 2 );
                return left_pos;
        },
        keepPosition : function(obj, skew){
                $(window).resize(function () {
                        var distance = methods.getLeftPos(skew);
                        if (config.isOpened == true) {
                                obj.css({
                                        "left" : distance + "px",
                                        "height" : $(window).height()
                                });
                        }
                        else {
                                obj.css({
                                        "height" : $(window).height()
                                });
                        }
                });
        },
        controls : function(obj){
                var openclosebutton = obj.selector + " span";

                if (config.isOpened == false) {
                        methods.showBlock($("#sk"), config.skew);
                        // move the button (opened position) to the left and...
                        obj.transition({
                                "left" : config.linepadding / 2
                        },1000);
                        // make it turn and become the close button
                        $(openclosebutton).transition({
                                "rotate" : "-1980deg"
                        },1000);
                }
                else if (config.isOpened == true) {
                        methods.hideBlock($("#sk"), config.skew);
                        // move the button (closed position) to the right and...
                        obj.transition({
                                "left" : (config.linewidth - config.linepadding) + "px"
                        },1000);
                        // make it turn and become the open button
                        $(openclosebutton).transition({
                                "rotate" : "0deg"
                        },1000);
                }                      
        }
};

$.fn.skewBlock = function(method) {
        //controls
        jQuery(document).bind('keydown', 'space', function(e) {
                if(config.waitingAction == true){
                        config.waitingAction = false;
                        methods.controls($("#sk_openclose"));
                }
        });
        $("#sk_openclose").click(function(){
                if(config.waitingAction == true){
                        config.waitingAction = false;
                        methods.controls($("#sk_openclose"));
                }
        });

        if ( methods[method] ) {
                return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply( this, arguments );
        } else {
                $.error( 'Method ' +  method + ' does not exist on my jQuery.skewBlock' );
        }

};    
})(jQuery);