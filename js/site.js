var domain = "http://votargif.com/";
var state_image_selector = "#states .state";
var play_on_rollover = false;
var is_mobile;

$(window).scroll(function(){
	if(is_mobile && !play_on_rollover){
        $(state_image_selector).each(function(i,e){
            var img = $(e).children("img");
            if(img[0].y > $(window).scrollTop() && img[0].y < $(window).scrollTop() + $(window).height()) {
				if(img.attr("src") != img.attr("gif")) {
            		img.attr("src", img.attr("gif"));
				}
            }
			else{
				if(img.attr("src") != img.attr("static")) {
            		img.attr("src", img.attr("static"));
				}
            }
        });
	}
});

$(window).load(function(){
    
	is_mobile = window.innerWidth < 550;
    
    if(is_mobile) {
        $("#mouse_over").text("ver estado");
    }
    $("#mouse_over").click(function(e) {
        $("#header span").removeClass("current");
        $(e.target).addClass("current");
        play_on_rollover = true;
        $(state_image_selector).each(function(i,e){
            var img = $(e).children("img");
            img.attr("src", img.attr("static"));
        });
    });
    
    $("#play_all").click(function(e) {
        $("#header span").removeClass("current");
        $(e.target).addClass("current");
        play_on_rollover = false;
        if(!is_mobile) {
	        $(state_image_selector).each(function(i,e){
	            var img = $(e).children("img");
	            img.attr("src", img.attr("gif"));
	        });
        }
    });
    
    if(is_mobile) {
        $("#play_all").click();
    }
    else {
        $("#mouse_over").click();
        
        $(state_image_selector).mouseover(function(e){
            $(e.target).parent().append($("<div></div>").addClass("cta"));
            if(play_on_rollover) {
                $(e.target).attr("src", $(e.target).attr("gif"));
            }
        });
        $(state_image_selector).mouseout(function(e){
            if($(e.toElement).parents(".state").length == 0 || $(e.toElement).parents(".state")[0] != $(e.delegateTarget)[0]){
                $(".cta").remove();
            }
            if(play_on_rollover) {
                $(e.target).attr("src", $(e.target).attr("static"));
            }
        });
    }
    
    $(state_image_selector).click(function(e){
        $("#lightbox").remove();
        
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

                var url = domain;
                var text = "Don't miss your state's deadline to register to vote! " + $(e.target).attr("tweet");
                var image_url = domain + "" + $(e.target).attr("state").toUpperCase() + ".gif";
				var caption = $(e.target).attr("description").replace("http://vote.usa.gov","<a href='http://vote.usa.gov'>http://vote.usa.gov</a>") + "<br/>(via <a href='http://votegif.com/'>http://votegif.com/</a>)";

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
                    OpenPopup("http://tumblr.com/widgets/share/tool?canonicalUrl=" + encodeURIComponent(image_url) + "&caption=" + encodeURIComponent(caption), 500, 250);
                    break;
                }
				
				ga('send', {
				  hitType: 'event',
				  eventCategory: 'States',
				  eventLabel: $(e.target).attr("state"),
				  eventAction: 'share_' + service,
				});
            });
            share_bar.append(share_button);
        });
        
        if(window.innerWidth > 640) {
            var copy_url_button = $("<div></div>").addClass("copy_url_button");
            $(copy_url_button).attr("data-clipboard-text", domain + "" + $(e.target).attr("state").toUpperCase() + ".gif");
            share_bar.append(copy_url_button);
        }
        
        var width = window.innerWidth < 640 ? window.innerWidth - 40 : 600;
        var height = window.innerWidth < 640 ? window.innerWidth - 30 : 550;
        content.css("width", width);
        content.css("margin-left", -(width / 2) + "px");
        content.css("height", height);
        content.css("margin-top", -(height / 2) + "px");
                
        $("body").append(lightbox);
        
        var clipboard = new Clipboard('.copy_url_button');
        clipboard.on('success', function(e) {
            $(".copy_url_button").addClass("copied");
			ga('send', {
			  hitType: 'event',
			  eventCategory: 'States',
			  eventLabel: $(e.target).attr("state"),
			  eventAction: 'share_direct',
			});
        });
		
        if(play_on_rollover) {
            $(e.target).attr("src", $(e.target).attr("static"));
        }
		
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'States',
		  eventLabel: $(e.target).attr("state"),
		  eventAction: 'click',
		});
		
    });
	
    if(!is_mobile){
	    $(window).keydown(function(e) {
	        if(e.which == 27) {
	            $("#lightbox").remove();
	        }
	    });
    }
	
	$(window).scroll();
});

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
