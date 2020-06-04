JApp = window.JApp || {};
$ = $ || jQuery;


window.JApp = (function (that) {

    var sDefaultHoster = "servint",
        sDefaultSource = "unknown",
        marketplaceAPI = '',
        sLoadedDefHoster = '',
        PATH_TO_JS = '/mp-widget/js/',
        oLocale = {
            "text": {
                "text": "Install",
                "txSuccess": "Check your \r email box",
                "txError": "Some error has occurred",
                "txEmailPlaceholder": "Your email",
                "txInvalidEmail": "The e-mail value is not valid",
                "txApplicationNotFound": "The selected host does not support this application",
                "txPreloader": "Loading",
                "apps": "All",
            },
            "lang": "en",
            "filter": ''
        },
        sHref = window.location.href;


    if ($("body").hasClass("home")) {
        sDefaultSource = "SP.en.index";
    }

    if ($("body").hasClass("page-id-1372")) {
        sDefaultSource = "SP.en.index-v1";
    }

    window.MARKETING_SOURCE = window.MARKETING_SOURCE || sDefaultSource;

    that.setAPI = function(sMarketplace) {
      that.marketplaceAPI = sMarketplace;
    };

    that.getFilter = function () {
        return oLocale.filter;
    }

    that.setFilter = function (sData) {
        return oLocale.filter = sData;
    }

    that.getLang = function () {
        return oLocale.lang;
    };

    that.text = function (sKey) {
        return oLocale.text[sKey];
    };

    that.setLocale = function(oData) {
        oLocale.text = $.extend(oLocale.text, oData);
    };

    that.getDefaultHoster = function () {
        return sLoadedDefHoster || sDefaultHoster;
    };

    that.isLoadedDefHoster = function () {
        return sLoadedDefHoster.length !== 0;
    };

    that.getMarketingSource = function () {
        return window.MARKETING_SOURCE || sDefaultSource;
    };

    that.url = {
        getSignupURL: function () {
            return "//platforms-info.jelastic.com/api/user/signup";
        },

        getUserDefHosterURL: function () {
            return "//platforms-info.jelastic.com/api/user/getdefhoster";
        },

        getUserCountryURL: function () {
            return "//platforms-info.jelastic.com/api/user/getcountry";
        },

        getHosters: function () {
            return "//platforms-info.jelastic.com/api/site/GetHosters";
        },

        getInstallAppURL: function () {
            return '//go.jelastic.com/InstallApp'
        }
    };

    that.loadApps = function (fnCallback) {
        $.ajax({
            type: "GET",
            url: JApp.url.getAppsURL(),
            data: {
                lang: that.getLang()
            },
            async: true,
            success: function (response) {
                var oResp = jQuery.parseJSON(response) || {};

                if (oResp.result == 0 && oResp.response) {
                    oResp = oResp.response;
                }

                if (fnCallback) {
                    fnCallback(oResp);
                }
            }
        });
    };

    that.loadHosters = function (fnCallback) {
        $.ajax({
            type: "GET",
            url: JApp.url.getHosters(),
            async: true,
            success: function (response) {

                if (response.result == 0 && response.hosters) {
                    oResp = response.hosters;
                }

                if (fnCallback) {
                    fnCallback(oResp);
                }
            }
        });
    };

    that.loadDefaultHoster = function (fnCallback) {
        $.ajax({
            type: "GET",
            url: JApp.url.getUserDefHosterURL(),
            async: true,
            success: function (response) {
                var oResp = jQuery.parseJSON(response) || {};

                if (oResp.result == 0 && oResp.response) {
                    oResp = oResp.response;
                }

                sLoadedDefHoster = oResp.hoster;

                if (fnCallback) {
                    fnCallback();
                }

            },

            error: function (jqXHR, textStatus, errorThrown) {

                sLoadedDefHoster = sDefaultHoster;

                if (fnCallback) {
                    fnCallback();
                }
            }
        });
    };

    that.GetUserCountry = function (fnCallback) {
        var sDefault = "N/A";

        $.ajax({
            type: 'POST',
            url: JApp.url.getUserCountryURL(),
            success: function (sResponse) {
                var oResp = jQuery.parseJSON(sResponse);

                if (oResp.result == 0 && oResp.response.result == 0) {
                    fnCallback(oResp.response.country);

                } else {
                    fnCallback(sDefault);
                }
            },
            error: function () {
                fnCallback(sDefault);
            }
        });
    }

    that.InstallApp = function (oParams, fnCallback) {

        var data = {
            email: oParams.email,
            app: oParams.appid,
            key: oParams.hoster,
            group: oParams.group,
            iref: document.location.href,
            eref: document.referrer,
            lang: 'en'
        }, fnCallbackWrap;

        fnCallbackWrap = function (response, textStatus) {
            var oResp = jQuery.parseJSON(response);
            if (fnCallback) {
                fnCallback(oResp);
            }
        };

        $.ajax({
            type: 'POST',
            data: data,
            url: JApp.url.getInstallAppURL(),
            success: fnCallbackWrap,
            error: fnCallbackWrap
        });
    };

    that.jsPath = function () {
        return PATH_TO_JS;
    };

    return that;
}(window.JApp || {}));


JApp.utils = (function (that) {

    that.addListener = function (oEl, sEvent, fnCallback) {

        if (oEl.addEventListener) {

            oEl.addEventListener(sEvent, fnCallback);

        } else if (oEl.attachEvent) {

            oEl.attachEvent("on" + sEvent, fnCallback);
        }
    };

    that.toCamelCase = function (str) {
        return str
            .replace(/\s(.)/g, function (s) {
                return s.toUpperCase();
            })
            .replace(/\s/g, '')
            .replace(/^(.)/, function (s) {
                return s.toLowerCase();
            });
    };

    that.isValidEmail = function (email) {
        var pattern = /.@./;
        return pattern.test(email);
    };

    that.isValidEmailStrong = function (email) {
        var pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/;
        return pattern.test(email);
    };

    that.cutStr = function (sStr, nMAxLng) {

        var STRING_SEP = ". ",
            aString;

        nMAxLng = nMAxLng || 90;

        if (sStr.length > nMAxLng) {
            aString = sStr.substring(0, nMAxLng).split(STRING_SEP);
            if (aString.length > 1) {
                aString.pop();
                sStr = aString.join(STRING_SEP) + ".";
            } else {
                sStr = sStr.substring(0, nMAxLng - 3) + "...";
            }
        }
        return sStr;
    }

    return that;
}(JApp.utils || {}));

JApp.utils.Modal = (function (that) {

    that.errors = {
        INVALID_EMAIL: JApp.text("txInvalidEmail"),
        SOME_ERROR_INSTALL: JApp.text("txError"),
    };


    that.show = function ($el, aOpt) {
        var nTimeoutId,
            sMsg = aOpt.msg,
            sPos = aOpt.position || 'right',
            nTimeOut = aOpt.hideTime || 5000,
            nWidth = 220,
            fnHide,
            bAutoHide = sMsg.autoHide || true;

        if (sPos === 'auto') {


            sPos = ($(window).width() - $el.offset().left - $el.width() > nWidth) ? 'right' : 'bottom';
        }

        fnHide = function () {
            if (bAutoHide) {
                clearTimeout(nTimeoutId);
            }
            $el.popover('hide');
        };

        $el.popover('destroy');

        $el.popover({
            placement: sPos,
            trigger: 'manual',
            animation: true,
            content: sMsg
        }).popover('show');

        if (bAutoHide) {
            nTimeoutId = setTimeout(function () {
                $el.popover('hide');
            }, nTimeOut);
        }

        $el.focus(function () {
            fnHide();
        });

        $el.keypress(function () {
            fnHide();
        });
    };

    return that;
}(JApp.utils.Modal || {}));

JApp.GA = (function (that) {

    that.track = function (oParams) {
        var aOptions = [
            oParams.event || '_trackEvent',
            oParams.action,
            oParams.label || '',
            oParams.value || ''
        ];

        if (!!oParams.redirect) {
            that.redirect(oParams.redirect);
        }

        if (window._gaq) {
            _gaq.push(aOptions);
        }
    };

    that.redirect = function (sLink) {
        var fnCallback = function () {
            window.location = sLink;
        };

        if (window._gaq) {
            _gaq.push(['_set', 'hitCallback', fnCallback]);

            setTimeout(fnCallback, 2500);
        } else {
            fnCallback()
        }

    };

    that.setCallback = function (fnCallback) {
        if (window._gaq) {
            _gaq.push(['_set', 'hitCallback', fnCallback]);
        }
    };

    that.trackSelectApp = function (appid) {
        that.track({
            action: 'Select-Application',
            label: 'Marketplace-Select-App',
            value: appid
        });
    };

    that.trackInstallApp = function (appid, nComplete) {
        that.track({
            action: 'Install-Application',
            label: 'Marketplace-Install-' + nComplete === 0 ? 'Success' : 'Error',
            value: appid
        });
    };

    that.trackPrivateCloudEmail = function () {
        that.track({
            action: 'Private-Cloud-Signup-Email',
            label: 'Sent-Email-Success'
        });
    };

    that.trackSignupSuccess = function (sHoster, sLink) {

        that.track({
            action: "Site-Signup-Success",
            label: JApp.getMarketingSource(),
            value: sHoster,
            redirect: sLink
        });
    };

    that.trackSignupError = function (sHoster, sMsg) {

        that.track({
            action: "Site-Signup-Success",
            label: JApp.getMarketingSource() + " >> " + sHoster,
            value: sMsg
        });
    };

    that.trackPageview = function (sPage) {

        if (window._gaq) {
            _gaq.push(['_trackPageview', sPage]);
        }
    }

    return that;
}(JApp.GA || {}));

JApp.bind = (function (that) {
    var $body = $('body');

    that.miss = function (sTarget, callback) {

        $body.on('click.miss', function (e) {

            if (e.originalEvent && $(e.target).closest(sTarget).length === 0) {

                if (callback() === false) {
                    $body.off('click.miss');
                    return false;
                }

            }

        });
    };

    return that;
}(JApp.bind || {}));

JApp.user = (function (that) {
    that.Signup = function (oData, sCurrentHoster, ops) {
        var oParams,
            sReferrer = document.referrer,
            sErrorWin = "#signup-error-",
            fCallback,
            bRedirect,
            sMarketingSource = (window.JApp ? JApp.getMarketingSource() : "unknown");

        function trackGA(success, sMsg, sLink) {
            sMsg = sMsg || "unknown";

            if (success === false) {

                JApp.GA.trackPageview("/signup/error");
                JApp.GA.trackSignupError(sCurrentHoster, sMsg);
            } else {

                JApp.GA.trackPageview("/signup/success");
                JApp.GA.trackSignupSuccess(sCurrentHoster, sLink);
            }
        }

        ops = ops || {};
        fCallback = ops.callback;
        bRedirect = ops.redirect !== false;

        oParams = JSON.stringify({
            "email": oData.email,
            //"firstName": oData.firstName || "",
            //"lastName": oData.lastName || "",
            //"company": oData.company || "",
            "hoster": sCurrentHoster,
            "referrer": sReferrer,
            "marketing_source": sMarketingSource,
            "lang": JApp.getLang()
        });

        $.ajax({
            type: "POST",
            url: JApp.url.getSignupURL(),
            async: true,
            data: {
                "data": oParams
            },
            success: function (response) {
                var oResp = jQuery.parseJSON(response),
                    success = true,
                    nResult = oResp.result,
                    sMsg;

                if (oResp && nResult == 0 && oResp.response) {
                    oResp = oResp.response;
                    nResult = oResp.result;
                }


                if (!oResp || nResult != 0) {
                    success = false;
                }

                if (success === false) {
                    oResp = oResp || "Response is undefined";
                    sMsg = JSON.stringify(oResp);

                    sErrorWin += nResult === 501 ? "email" : "network";
                    $(sErrorWin).modal({
                        backdrop: true,
                        keyboard: true,
                        show: true
                    });
                }


                trackGA(success, sMsg, String(oResp.app).indexOf("?") > -1 ? oResp.app : (oResp.app + '?signup=' + oResp.email));

                if (fCallback) {
                    fCallback(success, nResult);
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {

                textStatus = textStatus || "unknown";
                errorThrown = errorThrown || "unknown";

                trackGA(false, textStatus + ": " + errorThrown);


                if (fCallback) {
                    fCallback(false);
                }
            }
        });
    };

    return that;
}(JApp.user || {}));

JApp.Constants = {
    MP_MENU_WRAP: ".marketplace-menu-wrap",
    MP_MENU: '.marketplace-menu',
    MP_OFFERS: '.marketplace-offers',
    MP_OFFERS_WRAP: '.marketplace-offers-wrap'
};
