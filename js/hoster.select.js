(function ($) {

    $.fn.hosterSelect = function () {
        var self = $(this),
            $input = self.find('#hosters-input'),
            $inputVal = $input.val(),
            $hostersButon = self.find('.hoster-checker-btn'),
            $currentInfo = self.find('.hoster-checker-current-ct'),
            $hostersCarousel = self.find('.hosters-carousel'),
            $hostersCarouselControl = $hostersCarousel.find('.je-carousel-ct'),
            sCssClassExpanded = 'hosters-checker-expanded',
            fnInitDefaultHoster,
            bInitDefCor = false,
            bDisabled = false,
            oCarousel,
            fnSetCurrent,
            fnSlideSlider,
            sCurrentHoster,
            fnSetDefault,
            fnSetDisabled,
            fnGetData,
            oHosters = (function () {
                var oHosters = {};

                self.find(".je-carousel-item").each(function () {

                    var oData = $(this).data();

                    oData.isDefault = false;
                    oHosters[oData.val] = oData;
                });

                return oHosters;
            }()),
            fnIsDisabled;

        fnGetData = function () {
            return  oHosters[sCurrentHoster];
        };

        fnSetDisabled = function (value) {
            bDisabled = value;
            oCarousel.setDisabled(value);
        };

        fnSetDefault = function () {
            if (JApp.isLoadedDefHoster()) {
                fnInitDefaultHoster();

            } else {
                JApp.loadDefaultHoster(fnInitDefaultHoster);
            }
            bInitDefCor = false;
        };

        fnSetCurrent = function (sHoster) {
            $input.val(sHoster);
            self.trigger("selecthoster", oHosters[sHoster]);
        };

        fnSlideSlider = function (bSlideUp, bSimple) {
            var nSpeed = bSimple ? 0 : 150;
            bSlideUp = $.type(bSlideUp) === 'boolean' ? bSlideUp : $hostersButon.hasClass(sCssClassExpanded);

            if (!$hostersCarousel.is(':animated')) {

                if (bSlideUp) {
                    $hostersCarousel.slideUp(nSpeed);
                    $hostersButon.removeClass(sCssClassExpanded);
                } else {
                    $hostersCarousel.slideDown(nSpeed);
                    $hostersButon.addClass(sCssClassExpanded);
                }

                if (bInitDefCor === false) {
                    oCarousel.setCurrent(sCurrentHoster, false);
                    bInitDefCor = true;
                }

            }
        };

        fnInitDefaultHoster = function (sHoster) {
            sCurrentHoster = sHoster || JApp.getDefaultHoster();
            oHosters[sCurrentHoster].isDefault = true;
            oCarousel.setCurrent(sCurrentHoster, false);
            $hostersButon.removeClass('pre-init');
            fnSetCurrent(sCurrentHoster);
        };

        $.fn.hosterSelect.setDefault = fnSetDefault;

        $.fn.hosterSelect.toggleSlider = fnSlideSlider;

        $.fn.hosterSelect.setDisabled = fnSetDisabled;

        $.fn.hosterSelect.getData = fnGetData;

        $hostersButon.click(function () {
            if (!bDisabled) {
                fnSlideSlider();
            }
            return false;
        });

        oCarousel = $hostersCarouselControl.jeCarousel(function (value, name, location) {
            var sText = name + ' @ ' + location;

            sCurrentHoster = value;
            $currentInfo.html(sText);
            $currentInfo.attr("title", sText);
            fnSetCurrent(sCurrentHoster);
        }, 594)[0];



        if ($inputVal.length !== 0) {

            fnInitDefaultHoster($inputVal);
        } else {

            fnSetDefault();
        }
    };

    $(document).ready(function () {
        var $cont = $('.jelastic-hosters-carousel');

        if ($cont.length) {
            $cont.hosterSelect();
        }
    });

})(jQuery);
