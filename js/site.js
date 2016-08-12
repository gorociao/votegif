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
            $(".cta").remove();
            $(e.target).attr("src", $(e.target).attr("static"));
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

                var url = domain + $(e.target).attr("state");
                var text = "Share your state " + url;
                
                switch(service) {
                case "twitter":
                    OpenPopup("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text), 500, 250);
                    break;
                case "facebook":
                    // https://www.facebook.com/v2.1/dialog/share?app_id=406655189415060&display=popup&e2e=%7B%7D&href=http%3A%2F%2Fgph.is%2F12esg4c&locale=en_US&mobile_iframe=false&next=http%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2FLcj5EtQ5qmD.js%3Fversion%3D42%23cb%3Df318627991ec938%26domain%3Dgiphy.com%26origin%3Dhttp%253A%252F%252Fgiphy.com%252Ff213d15fd20fed8%26relation%3Dopener%26frame%3Df33ddbb2a77744%26result%3D%2522xxRESULTTOKENxx%2522&sdk=joey&version=v2.1
                    OpenPopup("https://www.facebook.com/v2.1/dialog/share?app_id=406655189415060&display=popup&href=" + encodeURIComponent(url) + "", 500, 250);
                    break;
                case "instagram":
                    break;
                case "tumblr":
                    OpenPopup("http://tumblr.com/widgets/share/tool?canonicalUrl=" + encodeURIComponent(url), 500, 250);
                    break;
                }
            });
            share_bar.append(share_button);
        });
        
        var copy_url_button = $("<div></div>").addClass("copy_url_button");
        $(copy_url_button).attr("data-clipboard-text", domain + $(e.target).attr("state") + ".gif");
        share_bar.append(copy_url_button);
        
        var width = 600;
        var height = 550;
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