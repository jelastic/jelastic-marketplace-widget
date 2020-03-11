jQuery(document).ready(function ($) {
    var oFrameNav,
        oWindNav;




    oFrameNav = new function () {

        var me = this,
            oWindow = $(window),
            oFrameUrl,
            oFrame;

        me.setCategory = function (sCat) {

            oFrame.contentWindow.postMessage(JSON.stringify({category : sCat}), oFrameUrl);
        };

        me.catchCategory = function (oEvent) {

            var oOriginEvent = oEvent.originalEvent,
                oMsg;

            if (oOriginEvent.data) {

                oMsg = JSON.parse(oOriginEvent.data);

                if (oMsg.hasOwnProperty("category")) {

                    oWindNav.setCategory(oMsg.category);
                }
            }
        };

        me.onFrameReady = function (oFr) {

            if (Modernizr.postmessage && Modernizr.history) {

                me.init();
                oWindNav.init();

                oFrame = oFr;
                oFrameUrl = oFrame.src.replace( /([^:]+:\/\/[^\/]+).*/, '$1');
            }
        };

        me.init = function () {

            oWindow.on("message", me.catchCategory);
        };
    };


    oWindNav = new function () {

        var me = this,
            oWindow = $(window),
            sHost = location.protocol + "//" + location.host,
            sBasePathName = "/";

        me.setCategory = function (sCat) {

            var sLocation = sHost + sBasePathName + sCat;


            if (sLocation !== location.href) {

                window.history.pushState(null, null, sLocation);
            }
        };

        me.getCategory = function () {

            return location.pathname.replace(sBasePathName, "").replace(/(\/)?$/, "");
        };


        me.init = function () {

            oWindow.on("popstate", function () {
                oFrameNav.setCategory(me.getCategory());
            });
        };
    };

    //Global function will be executed when widget appears in DOM
    window.Jelastic = {};
    Jelastic.onMarketplaceReady = function (oFrame) {

        oFrameNav.onFrameReady(oFrame);
    };
});