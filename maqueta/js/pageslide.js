;
$(document).ready(function(){
(function ($) {
    var $body = $('body'),
        $pageslide = $('#pageslide');
    var _sliding = false,
        _lastCaller;
    if ($pageslide.length == 0) {
        $pageslide = $('<div />').attr('id', 'pageslide').css('display', 'none').appendTo($('body'));
    }

    function _load(url, useIframe) {
        if (url.indexOf("#") === 0) {
            $(url).clone(true).appendTo($pageslide.empty()).show();
        }
        else {
            if (useIframe) {
                var iframe = $("<iframe />").attr({
                    src: url,
                    frameborder: 0,
                    hspace: 0
                }).css({
                    width: "100%",
                    height: "100%"
                });
                $pageslide.html(iframe);
            }
            else {
                $pageslide.load(url);
            }
            $pageslide.data('localEl', false);
        }
    }

    function _start(direction, speed) {
        var slideWidth = $pageslide.outerWidth(true),
            bodyAnimateIn = {}, slideAnimateIn = {};
        if ($pageslide.is(':visible') || _sliding) return;
        _sliding = true;
        switch (direction) {
        case 'left':
            $pageslide.css({
                left: 'auto',
                right: '-' + slideWidth + 'px'
            });
            slideAnimateIn['right'] = '+=' + slideWidth;
            $('html,body').css("overflow", "hidden");
            $('body').removeClass("scrollable");
            break;
        default:
            $pageslide.css({
                left: '-' + slideWidth + 'px',
                right: 'auto'
            });
            slideAnimateIn['left'] = '+=' + slideWidth;
            $('html,body').css("overflow", "hidden");
            $('body').removeClass("scrollable");
            break;
        }
        $body.animate(bodyAnimateIn, speed);
        $pageslide.show().animate(slideAnimateIn, speed, function () {
            _sliding = false;
        });

    }

    $.fn.pageslide = function (options) {
        var $elements = this;
        $elements.click(function (e) {
            var $self = $(this),
                settings = $.extend({
                    href: $self.attr('href')
                }, options);
            e.preventDefault();
            e.stopPropagation();
            if ($pageslide.is(':visible') && $self[0] == _lastCaller) {
                $.pageslide.close();
            }
            else {
                $.pageslide(settings);
                _lastCaller = $self[0];
            }
        });
    };
    $.fn.pageslide.defaults = {
        speed: 300,
        direction: 'right',
        modal: false,
        iframe: true,
        href: null
    };
    $.pageslide = function (options) {
        var settings = $.extend({}, $.fn.pageslide.defaults, options);
        if ($pageslide.is(':visible') && $pageslide.data('direction') != settings.direction) {
            $.pageslide.close(function () {
                _load(settings.href, settings.iframe);
                _start(settings.direction, settings.speed);
            });
        }
        else {
            _load(settings.href, settings.iframe);
            if ($pageslide.is(':hidden')) {
                _start(settings.direction, settings.speed);
            }
        }
        $pageslide.data(settings);
    }
    $.pageslide.close = function (callback) {
        var $pageslide = $('#pageslide'),
            slideWidth = $pageslide.outerWidth(true),
            speed = $pageslide.data('speed'),
            bodyAnimateIn = {}, slideAnimateIn = {}
        if ($pageslide.is(':hidden') || _sliding) return;
        _sliding = true;
        switch ($pageslide.data('direction')) {
        case 'left':
            bodyAnimateIn['margin-left'] = 0;
            slideAnimateIn['right'] = '-=' + slideWidth;
            $('html,body').css("overflow", "visible");
            $('body').addClass("scrollable");
            break;
        default:
            bodyAnimateIn['margin-left'] = 0;
            slideAnimateIn['left'] = '-=' + slideWidth;
            $('html,body').css("overflow", "visible");
            $('body').addClass("scrollable");
            break;
        }
        $pageslide.animate(slideAnimateIn, speed);
        $body.animate(bodyAnimateIn, speed, function () {
            $pageslide.hide();
            _sliding = false;
            if (typeof callback != 'undefined') callback();
        });
    }
    $pageslide.click(function (e) {
        e.stopPropagation();
    });
    $(document).bind('click keyup', function (e) {
        if (e.type == "keyup" && e.keyCode != 27) return;
        if ($pageslide.is(':visible') && !$pageslide.data('modal')) {
            $.pageslide.close();
        }
    });
})(jQuery);


$(document).on('click', 'div.closepage .icono-trab', function(){
   $.pageslide.close();
});

});
