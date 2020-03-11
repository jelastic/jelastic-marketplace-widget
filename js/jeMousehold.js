jQuery.fn.jeMousehold = function () {
    var delay = 150,
        $ = jQuery;

    return this.each(function () {
        var $t = $(this),
            clearMousehold,
            timer;

        $t.mousedown(function () {
//            if (f) {
//                f();
//            }
            timer = setTimeout(function () {
                $t.mousedown();
            }, delay);
        });

        clearMousehold = function () {
            clearTimeout(timer);
        };

        $t.mouseout(clearMousehold);
        $t.mouseup(clearMousehold);
    });

};
