var domain = "http://votegif.com/";
var state_image_selector = "#states .state";

function OpenPopup(url, w, h) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, "", 'scrollbars=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    if (window.focus) {
        newWindow.focus();
    }
}

$(window).load(function(){
    
    if(window.innerWidth < 550) {
        $(state_image_selector).each(function(i,e){
            var img = $(e).children("img");
            img.attr("src", img.attr("gif"));
        });
    }
    else {
        $(state_image_selector).mouseover(function(e){
            $(e.target).parent().append($("<div></div>").addClass("cta"));
            $(e.target).attr("src", $(e.target).attr("gif"));
        });
        $(state_image_selector).mouseout(function(e){
            if($(e.toElement).parents(".state").length == 0 || $(e.toElement).parents(".state")[0] != $(e.delegateTarget)){
                $(".cta").remove();
                $(e.target).attr("src", $(e.target).attr("static"));
            }
        });
    }
    
    $(state_image_selector).click(function(e){
        $("#lightbox").remove();
        
        $(e.target).attr("src", $(e.target).attr("static"));
        
        var lightbox = $("<div></div>").attr("id","lightbox");
        $(lightbox).click(function(lightbox_click_event) {
            if($(lightbox_click_event.target).attr("id")=="lightbox") {
                $("#lightbox").remove();
            }
        });
        
        var content = $("<div></div>").addClass("content");
        lightbox.append(content);
        
        var padding = $("<div></div>").addClass("padding");
        content.append(padding);
        
        var close_button = $("<div></div>").addClass("close_button");
        close_button.click(function(e){
            $("#lightbox").remove();
        });
        padding.append(close_button);
        
        var state_gif = $("<img/>").attr("class","state_gif").attr("src",$(e.target).attr("gif"));
        padding.append(state_gif);
        
        var share_bar = $("<div></div>").addClass("share_bar");
        padding.append(share_bar);
        
        $(["twitter","facebook","tumblr"]).each(function(i,service){
            var share_button = $("<div></div>").addClass("share_button").addClass("share_" + service).attr("id","share_" + service);
            share_button.css("background", "url(./images/" + service + ".svg) no-repeat center");
            share_button.click(function(share_button_click_event) {

                var url = domain; // + $(e.target).attr("state");
                var text = "Share your state " + url;
                var image_url = domain + "images/gifs/" + $(e.target).attr("state").toUpperCase() + ".gif";
                
                switch(service) {
                case "twitter":
                    OpenPopup("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text), 500, 250);
                    break;
                case "facebook":
                    OpenPopup("https://www.facebook.com/v2.1/dialog/share?app_id=147255609045485&display=popup&href=" + encodeURIComponent(image_url) + "", 500, 250);
                    break;
                case "instagram":
                    break;
                case "tumblr":
                    OpenPopup("http://tumblr.com/widgets/share/tool?canonicalUrl=" + encodeURIComponent(image_url), 500, 250);
                    break;
                }
            });
            share_bar.append(share_button);
        });
        
        if(window.innerWidth > 640) {
            var copy_url_button = $("<div></div>").addClass("copy_url_button");
            $(copy_url_button).attr("data-clipboard-text", domain + "images/gifs/" + $(e.target).attr("state").toUpperCase() + ".gif");
            share_bar.append(copy_url_button);
        }
        
        var width = window.innerWidth < 640 ? window.innerWidth - 40 : 600;
        var height = window.innerWidth < 640 ? window.innerWidth - 90 : 550;
        content.css("width", width);
        content.css("margin-left", -(width / 2) + "px");
        content.css("height", height);
        content.css("margin-top", -(height / 2) + "px");
                
        $("body").append(lightbox);
        
        var clipboard = new Clipboard('.copy_url_button');
        clipboard.on('success', function(e) {
            $(".copy_url_button").addClass("copied");
        });
    });
    $(window).keydown(function(e) {
        // Escape key pressed
        if(e.which == 27) {
            $("#lightbox").remove();
        }
    });
    
    // $(state_image_selector).click();
});