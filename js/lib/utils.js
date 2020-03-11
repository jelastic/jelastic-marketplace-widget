(function (JApp) {

    JApp.utils = (function (oUtils) {

        oUtils.idInc = (new Date).getTime();

        // checking for item existence
        oUtils.is = function (item) {
            return typeof item !== "undefined" && item !== null;
        };

        oUtils.isObject = function (v) {
            return v && (v.constructor === Object || typeof v == "object");
        };

        // iterates an array or an obeject calling the supplied function
        oUtils.each = function (values, fCallback) {
            var i, n;

            if(values &&  oUtils.isArray(values)) {
                for(i = 0, n = values.length; i < n; i += 1) {
                    if(oUtils.is(fCallback) && fCallback(values[i], i) === false) {
                        return;
                    }
                }
            } else {
                if(values && oUtils.isObject(values)){
                    for(i in values) {
                        if(Object.prototype.hasOwnProperty.call(values, i)) {
                            if(oUtils.is(fCallback) && fCallback(i, values[i]) === false) {
                                return;
                            }
                        }
                    }
                }
            }
        } ;

        oUtils.isArray = function (v){
            return v !== null && (typeof v === "object") && (typeof v.pop === "function") && (typeof v.push === "function");
        };


        oUtils.id = function (sPrefix) {
            return (sPrefix || "je-") + ++oUtils.idInc;
        };

        // Copies all the properties of config to object
        oUtils.apply = function(object, config, defaults) {
            if (defaults) {
                App.apply(object, defaults);
            }

            if (object && config && typeof config === 'object') {
                for (var i in config) {
                    if(Object.prototype.hasOwnProperty.call(config, i)) {
                        object[i] = config[i];
                    }
                }
            }

            return object;
        };

        oUtils.isFunction = (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return toString.call(value) === '[object Function]';
        } : function(value) {
            return typeof value === 'function';
        };

        oUtils.namespace = function (context) {
            var len1 = arguments.length,
                i = 1,
                len2,
                j,
                main,
                ns,
                sub,
                current;

            context = context || {};

            for(; i < len1; ++i) {
                main = arguments[i];
                ns = arguments[i].split('.');
                current = context[ns[0]];
                if (typeof current === "undefined") {
                    current = context[ns[0]] = {};
                }
                sub = ns.slice(1);
                len2 = sub.length;
                for(j = 0; j < len2; ++j) {
                    current = current[sub[j]] = current[sub[j]] || {};
                }
            }
            return current;
        };

        return oUtils;

    } (JApp.utils || {}));


    JApp.utils.DOM = (function (oDOMUtils) {

        var oUtils = JApp.utils;

        oDOMUtils.applyStyle = function (oEl, oStyle) {

            oUtils.each(oStyle, function (sKey, sValue) {

                oEl.style[sKey] = sValue;
            });
        };

        /**
         * return DOM attributes that begin on "data-"
         * @param DOM Element
         * @return Object
         * */
        oDOMUtils.getData = function (oElement) {

            var aAttrs = oElement.attributes,
                sPrefix = "data-",
                oData = {};

            oUtils.each(aAttrs, function (sAttr, oParam) {
                var sName = oParam.name;

                if (sName && sName.indexOf(sPrefix) === 0) {

                    oData[sName.replace(sPrefix, "")] = oParam.value;
                }
            });
            return oData;
        };

        oDOMUtils.getByClassName = function (sClass) {
            var aElements = [];

            if (document.getElementsByClassName) {

                aElements = document.getElementsByClassName(sClass);

            } else if (document.querySelectorAll) {

                aElements = document.querySelectorAll("." + sClass);
            }

            return  Array.prototype.slice.call(aElements);
        };

        oDOMUtils.addListener = function(oEl, sEvent, fnCallback) {

            if (oEl.addEventListener) {

                oEl.addEventListener(sEvent, fnCallback);

            } else if (oEl.attachEvent) {

                switch (sEvent) {
                    case "click" : sEvent = "onclick"; break;
                }
                oEl.attachEvent(sEvent, fnCallback);
            }
        };

        oDOMUtils.removeListener = function (oEl, sEvent, fnCallback) {

            if (oEl.removeEventListener) {

                oEl.removeEventListener(sEvent, fnCallback);

            } else if (oEl.detachEvent) {

                switch (sEvent) {
                    case "click" : sEvent = "onclick"; break;
                }
                oEl.detachEvent(sEvent, fnCallback);
            }
        };

        oDOMUtils.offset = function (oEl) {

            var oClientBox = oEl.getBoundingClientRect(),
                oBody = document.body,
                oDocElem = document.documentElement,
                nScrollTop = window.pageYOffset || oDocElem.scrollTop || oBody.scrollTop,
                nScrollLeft = window.pageXOffset || oDocElem.scrollLeft || oBody.scrollLeft,
                nClientTop = oDocElem.clientTop || oBody.clientTop || 0,
                nClientLeft = oDocElem.clientLeft || oBody.clientLeft || 0,
                nTop  = oClientBox.top +  nScrollTop - nClientTop,
                nLeft = oClientBox.left + nScrollLeft - nClientLeft;

            return {
                top: Math.round(nTop),
                left: Math.round(nLeft)
            }
        };

        return oDOMUtils;
    } (JApp.utils.DOM || {}));


    window.JApp = JApp;
}( window.JApp || {}));