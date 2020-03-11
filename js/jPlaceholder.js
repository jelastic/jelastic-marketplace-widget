jQuery.fn.jPlaceholder = function () {
    var sPlaceholderCss = "has-placeholder";

    this.each(function () {
        var me = $(this),
            sPlaceHolder = me.data('placeholder'),
            fnIsNative;

        fnIsNative = function () {
            return me.val() === sPlaceHolder;
        },
            fnSetPlaceholder = function () {
                if (me.val().length === 0) {
                    me.val(sPlaceHolder).addClass(sPlaceholderCss);
                }
            };

        if (sPlaceHolder) {
            me.focus(function () {
                if (fnIsNative()) {
                    me.val('').removeClass(sPlaceholderCss);
                }
            });

            me.blur(fnSetPlaceholder);

            fnSetPlaceholder();
        }
    });

    return this;
};