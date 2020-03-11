JApp = window.JApp || {};
JApp.utils = JApp.utils || {};

JApp.utils.FramePost = (function() {
    var XD = function() {

        var interval_id,
            last_hash = document.location.hash,
            cache_bust = 1,
            attached_callback;

        this.postMessage = function(message, target_url, target) {

            if (!target_url) {
                return;
            }

            target = target || parent;  // default to parent

            if (window['postMessage']) {
                // the browser supports window.postMessage, so call it with a targetOrigin
                // set appropriately, based on the target_url parameter.
                target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));

            } else if (target_url) {
                // the browser does not support window.postMessage, so set the location
                // of the target to target_url#message. A bit ugly, but it works! A cache
                // bust parameter is added to ensure that repeat messages trigger the callback.
                target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + encodeURIComponent(message);
            }
        };

        this.stop = function () {

            if (attached_callback) {

                if (window.removeEventListener) {

                    window.removeEventListener('message', attached_callback, !1);
                } else {
                    window.detachEvent('onmessage', attached_callback);
                }
            }

            if (interval_id) {
                clearInterval(interval_id);
            }
        };

        this.receiveMessage = function(callback, source_origin) {

            // browser supports window.postMessage
            if (window['postMessage']) {
                // bind the callback to the actual event associated with window.postMessage
                if (callback) {

                    attached_callback = function(e) {
                        if ((typeof source_origin === 'string' && e.origin !== source_origin.replace( /([^:]+:\/\/[^\/]+).*/, '$1'))
                            || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
                            return !1;
                        }
                        callback(e);
                    };
                }
                if (window['addEventListener']) {

                    window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
                } else {
                    window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
                }
            } else {
                // a polling loop is started & callback is called whenever the location.hash changes
                interval_id && clearInterval(interval_id);
                interval_id = null;

                if (callback) {
                    interval_id = setInterval(function(){
                        var hash = document.location.hash,
                            re = /^#?\d+&/;
                        if (hash !== last_hash && re.test(hash)) {
                            last_hash = hash;
                            callback({data: decodeURIComponent(hash.replace(re, ''))});
                        }
                    }, 100);
                }
            }
        }
    }
    return function (oConfig) {
        oConfig = oConfig || {};

        var me = this,
            sUrl = oConfig.targetUrl,
            oTarget = oConfig.target || window.parent,
            oXD = new XD(),
            sToken = oConfig.token;

        if (!JSON) {
            (function(oDoc, sTag){
                var oScript = oDoc.createElement(sTag),
                    s=oDoc.getElementsByTagName(sTag)[0];

                oScript.src = "//d00ce9870450abc280bb42d1f42a066e.app.dev.jelastic.com/lib/3dparty/json2.js";
                s.parentNode.insertBefore(oScript ,s)}(document,"script"));
        }

        me.on = function (fnCallback) {

            oXD.receiveMessage(function (oResponse) {

                var oData = JSON.parse(oResponse.data);

                if (oData.token == sToken) {
                    fnCallback(oData);
                }

            }, sUrl);
            return me;
        };

        me.send = function (oData) {

            oData.token = sToken;
            oXD.postMessage(JSON.stringify(oData), sUrl, oTarget);

            return me;
        };

        me.destroy = function () {
            oXD.stop();
        };

        return me;
    };

}());