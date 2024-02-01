jQuery(document).ready(function ($) {

    (function () {

        var $marketplaces = $('.j-app-mp'),
            sJsPAth = JApp.jsPath(),

            CSS_SHOW_DETAIL = 'details',
            CSS_SHOW_FORM = 'show-form',
            CSS_SHOW_LOADING = 'loading',
            CSS_SHOW_INSTALLED_MSG = 'show',
            CSS_ERROR = 'error',
            CSS_MOBILE_MENU = 'mobile',
            CSS_OPEN_MOB_MENU = 'opened',
            CSS_OVERLAY = 'form-is-shown';

        fnInitDefaultHoster = function (sHoster) {
            sCurrentHoster = sHoster || JApp.getDefaultHoster();
            oHosters.load({
                currentHoster: sCurrentHoster
            });
        };

        $.each($marketplaces, function (index, marketplace) {

            JApp.setLocale($(marketplace).data());

            var API = '//marketplace.jelastic.com/';
            if ($(marketplace).data('mpapi')) API = $(marketplace).data('mpapi');
            JApp.setAPI(API);

            window.hoster = false;
            if ($(marketplace).data('key')) window.hoster = $(marketplace).data('key');

            window.group = false;
            if ($(marketplace).data('group')) window.group = $(marketplace).data('group');

            var client_apps = $(marketplace).data('apps');
            if (client_apps) {
                var client_apps_obj = {};
                client_apps = client_apps.split(',').map(function(item) {
                    return item.trim();
                });
                client_apps_obj['app_id'] = client_apps;
                client_apps_obj = JSON.stringify(client_apps_obj);
                if (client_apps_obj) {
                    JApp.setFilter(client_apps_obj);
                    $(this).addClass('without-menu');
                }
            }

            sHtml = new EJS({url: sJsPAth + 'template/mp.js?v=170823'}).render({
                text: JApp.text
            });
            $(marketplace).html(sHtml);


            $(this).attr('id', 'mp-' + index);

            if (!$('#hosters').length) {
                if (JApp.isLoadedDefHoster()) {
                    fnInitDefaultHoster();
                } else {
                    JApp.loadDefaultHoster(fnInitDefaultHoster);
                }
            }

        });


        var $wind = $(window),
            DEFAULT_CAT = "apps",
            EXPR_EXCLUDE_CAT = /^docker/,
            MOBILE_WIND_WIDTH = 1000,
            $marketplaceWrap = $('.marketplace'),
            $loading = $marketplaceWrap.find(".app-loading"),
            $preloading = $marketplaceWrap.find('.marketplace-preloading'),
            $cnt = $('.marketplace-apps-cont'),
            SET_CATEGORY_PM = "category",
            bInitedLoad = false,
            fnSetLoading,
            oCats,
            oApps,
            objQueryString = {};

        fnSetLoading = function (bShow) {
            if (!bInitedLoad) {
                if (oHosters.loaded && oApps.loaded && oCats.loaded) {
                    $preloading.hide();
                    $cnt.show();
                    bInitedLoad = true;
                }
            } else {
                $loading.toggle(bShow);
            }
        };

        getParameterByName = function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

        fnInsertParam = function (key, value) {
            //Get query string value
            var searchUrl = location.search;
            if (searchUrl.indexOf("?") == "-1") {
                var urlValue = '?' + key + '=' + value;
                history.pushState({state: 1, rand: Math.random()}, '', urlValue);
            } else {
                //Check for key in query string, if not present
                if (searchUrl.indexOf(key) == "-1") {
                    var urlValue = searchUrl + '&' + key + '=' + value;
                }
                else {	//If key present in query string
                    oldValue = getParameterByName(key);
                    if (searchUrl.indexOf("?" + key + "=") != "-1") {
                        urlValue = searchUrl.replace('?' + key + '=' + oldValue, '?' + key + '=' + value);
                    }
                    else {
                        urlValue = searchUrl.replace('&' + key + '=' + oldValue, '&' + key + '=' + value);
                    }
                }
                history.pushState({state: 1, rand: Math.random()}, '', urlValue);
            }
            objQueryString.key = value;
        };

        fnRemoveQString = function (key) {
            var urlValue = document.location.href;

            //Get query string value
            var searchUrl = location.search;

            if (key != "") {
                oldValue = getParameterByName(key);
                removeVal = key + "=" + oldValue;
                if (searchUrl.indexOf('?' + removeVal + '&') != "-1") {
                    urlValue = urlValue.replace('?' + removeVal + '&', '?');
                }
                else if (searchUrl.indexOf('&' + removeVal + '&') != "-1") {
                    urlValue = urlValue.replace('&' + removeVal + '&', '&');
                }
                else if (searchUrl.indexOf('?' + removeVal) != "-1") {
                    urlValue = urlValue.replace('?' + removeVal, '');
                }
                else if (searchUrl.indexOf('&' + removeVal) != "-1") {
                    urlValue = urlValue.replace('&' + removeVal, '');
                }
            }
            else {
                var searchUrl = location.search;
                urlValue = urlValue.replace(searchUrl, '');
            }
            history.pushState({state: 1, rand: Math.random()}, '', urlValue);
        };

        oApps = (function ($cnt) {

            var oUtils = JApp.utils,
                $OfferCntWrap = $cnt.find('.marketplace-offers-wrap'),
                $OfferCnt = $cnt.find('.marketplace-offers'),
                SELECTOR_OFFER = '.marketplace-offer',
                $hosterSelectWrap = $(".marketplace-hoster-selector"),
                $hosterSelect = $hosterSelectWrap.find('.jelastic-hosters-carousel'),
                $marketplace = $cnt.closest('.j-app-mp'),
                me = {
                    loaded: false,
                    page: 1,
                    cat: DEFAULT_CAT,
                    XHR: undefined,
                    beforeLoad: function () {
                        me.loaded = false;
                        fnSetLoading(true);
                    },
                    afterLoad: function () {
                        me.loaded = true;
                        fnSetLoading(false);
                    },
                    load: function (sCat, nPage, fnCallback) {

                        if (!me.loaded && me.XHR) {
                            me.XHR.abort();
                        }

                        me.beforeLoad();
                        nPage = parseInt(nPage || 1, 10);
                        sCat = sCat || me.cat;

                        nPage < 2 ? fnRemoveQString('mpage') : fnInsertParam('mpage', nPage);

                        $OfferCnt.removeClass(CSS_OVERLAY);

                        me.XHR = JApp.marketplaceStore.loadApps(function (oResp) {

                            me.page = nPage;
                            me.cat = sCat;

                            me.afterLoad();
                            if (fnCallback) {
                                fnCallback();
                            }

                            me.onLoad(oResp);

                        }, sCat, nPage);

                    },
                    getPaging: function (nCount, nCurrent) {
                        var aPages = [],
                            aHasPages = [],
                            MIN_HIDE_IN_DOTS = 2,
                            MANDATORY_SIDE = 2,
                            SHOW = 5,
                            i;

                        function canAdd(nPage) {
                            return nPage > 0 && nPage <= nCount && aHasPages.indexOf(nPage) === -1;
                        }

                        function add(nPage, bBefore, sText) {
                            sText = sText || nPage;
                            if (canAdd(nPage)) {
                                aPages[bBefore ? "unshift" : "push"]({
                                    num: nPage,
                                    text: sText,
                                    active: nPage === nCurrent
                                });
                                aHasPages.push(nPage);
                            }
                        }

                        add(nCurrent);
                        for (i = 1; i <= nCount; i++) {
                            add(nCurrent - i, true);
                            add(nCurrent + i);
                            if (aPages.length >= SHOW) {
                                if (canAdd(nCurrent - i - (MANDATORY_SIDE + MIN_HIDE_IN_DOTS))) {
                                    aPages.unshift({
                                        text: '...'
                                    });
                                } else {

                                    add(nCurrent - i - 1, true);
                                }
                                add(2, true);
                                add(1, true);
                                if (canAdd(nCurrent + i + (MANDATORY_SIDE + MIN_HIDE_IN_DOTS))) {
                                    aPages.push({
                                        text: '...'
                                    });
                                } else {
                                    add(nCurrent + i + 1);
                                }
                                add(nCount - 1);
                                add(nCount);
                                break;
                            }
                        }
                        //prev
                        if (nCurrent !== 1) {
                            aPages.unshift({
                                text: '«',
                                num: 1
                            });
                        }
                        //next
                        if (nCurrent !== nCount) {
                            aPages.push({
                                text: '»',
                                num: nCount
                            });
                        }
                        return aPages;
                    },
                    onLoad: function (oResp) {

                        var nPages = Math.ceil(oResp.total / JApp.marketplaceStore.perPage),
                            aApps = [],
                            sHtml;

                        $.each(oResp.apps, function (nIndex, oApp) {

                            var oDescr = $("<span>" + (oApp.shortDescription || "") + "</span>");

                            //remove tags
                            oApp.shortDescription = oDescr.text();

                            aApps.push(oApp);
                        });
                        
                        theme = $marketplace.attr('data-theme');
                        oFilter = JApp.getFilter();
                        oFilter ? oFilter = JSON.parse(oFilter) : oFilter = [];
                        
                        if ((oFilter['app_id']) && (oFilter['app_id'].length > 0) && (theme === 'mini')) {

                            sHtml = new EJS({url: sJsPAth + 'template/app-mini.js?v=170823'}).render({
                                apps: aApps,
                                pages: me.getPaging(nPages, me.page),
                                cutDescr: oUtils.cutStr,
                                text: JApp.text,
                                hoster: window.hoster
                            });
                        } else {

                            sHtml = new EJS({url: sJsPAth + 'template/app.js?v=170823'}).render({
                                apps: aApps,
                                pages: me.getPaging(nPages, me.page),
                                cutDescr: oUtils.cutStr,
                                text: JApp.text,
                                hoster: window.hoster
                            });
                        }


                        $hosterSelect.appendTo($hosterSelectWrap);

                        $OfferCnt.html(sHtml);

                        $OfferCnt.toggleClass("has-pagging", nPages > 1);

                        $OfferCnt.find(SELECTOR_OFFER).mpOffer($hosterSelect);

                        $OfferCntWrap.find(".pagination a").click(function () {

                            var oLink = $(this),
                                nPage = oLink.attr("data-page");

                            if (nPage !== me.page && !oLink.hasClass("active")) {
                                me.load(me.cat, nPage);
                                var $page = $('html, body');
                                    $page.animate({
                                        scrollTop: $($cnt).offset().top
                                    }, 900);
                            }
                            return false;
                        });
                    }
                };

            return me;
        }($cnt));

        oCats = (function ($cntWrap) {

            var $cont = $cntWrap.find(".cat-items"),
                $menuWrap = $cntWrap.find(JApp.Constants.MP_MENU_WRAP),
                $menuCnt = $cntWrap.find(JApp.Constants.MP_MENU),
                bOpenedMobileMenu,
                bIsMobileMenu,
                mobileMenuTrigger = $cnt.find('.current-item'),
                me = {
                    loaded: false,
                    CLASS_ACTIVE: "active",
                    current: DEFAULT_CAT,
                    load: function (fnCallback) {

                        me.beforeLoad();

                        JApp.marketplaceStore.loadCat(function (oResp) {

                            var sCats = '';

                            oResp.objects =
                                $.each(oResp.objects, function (n, oCat) {
                                    var sTitle,
                                        sLang = JApp.getLang();

                                    if (typeof oCat.title === "string") {

                                        sTitle = oCat.title;
                                    } else {

                                        if (oCat.title.hasOwnProperty(sLang)) {

                                            sTitle = oCat.title[sLang];
                                        } else {

                                            $.each(oCat.title, function (sLang, sValue) {
                                                sTitle = sValue;
                                                return false;
                                            });
                                        }

                                    }

                                    if (!EXPR_EXCLUDE_CAT.test(oCat.name)) {

                                        sCats += '<a class="menu-item ' + (oCat.highlighted ? "marked" : "") + '" href="#" data-filter="' + oCat.name + '">' + sTitle + '</a>';
                                    }
                                });

                            $cont.append(sCats);


                            if (fnCallback) {
                                fnCallback();
                            }
                            me.afterLoad();
                        });
                    },
                    afterLoad: function () {

                        $menuWrap.find(".menu-item[data-filter='" + me.current + "']").addClass(me.CLASS_ACTIVE);
                        mobileMenuTrigger.text($menuWrap.find(".menu-item[data-filter='" + me.current + "']").text());

                        $menuWrap.find(".menu-item").click(function () {
                            var oCat = $(this),
                                sCat = oCat.attr("data-filter")
                            urlParam = oCat.attr('data-filter').substring(oCat.attr('data-filter').lastIndexOf('/') + 1);

                            if (!oCat.hasClass(me.CLASS_ACTIVE)) {


                                sCat === DEFAULT_CAT ? fnRemoveQString('filter') : fnInsertParam('filter', urlParam);

                                $menuWrap.find("." + me.CLASS_ACTIVE).removeClass(me.CLASS_ACTIVE);
                                oCat.addClass(me.CLASS_ACTIVE);

                                me.current = sCat;

                                if (me.onChange) {
                                    me.onChange(sCat);
                                }

                                mobileMenuTrigger.text(oCat.text());

                                me.toggleMenu(false);
                            }

                            return false;
                        });

                        me.loaded = true;
                        fnSetLoading(false);
                    },
                    beforeLoad: function () {
                        me.loaded = false;
                        fnSetLoading(true);
                    },
                    toggleMenu: function (bToOpen) {
                        var nSpeed = 150;

                        bToOpen = bToOpen || !bOpenedMobileMenu;

                        if (bIsMobileMenu) {
                            if (bToOpen && bOpenedMobileMenu !== true) {
                                $menuWrap.addClass(CSS_OPEN_MOB_MENU);
                                $menuCnt.slideDown(nSpeed, me.onResize);
                                bOpenedMobileMenu = true;

                            } else if (bOpenedMobileMenu !== false) {
                                $menuWrap.removeClass(CSS_OPEN_MOB_MENU);
                                $menuCnt.css('display', 'none');

                                bOpenedMobileMenu = false;
                            }
                            me.onResize();
                        }
                    },
                    onResize: function () {

                        if ($wind.width() > MOBILE_WIND_WIDTH) {
                            if (bIsMobileMenu !== false) {
                                $marketplaceWrap.removeClass(CSS_MOBILE_MENU);
                                $menuCnt.show();
                                bIsMobileMenu = false;
                            }

                        } else {
                            if (bIsMobileMenu !== true) {
                                $marketplaceWrap.addClass(CSS_MOBILE_MENU);
                                $menuCnt.hide();
                                bIsMobileMenu = true;
                            }
                        }
                    },
                    initMenu: function () {

                        mobileMenuTrigger.click(function () {
                            me.toggleMenu();
                            return false;
                        });

                        $wind.resize(me.onResize);
                        me.onResize();
                    },
                    onChange: undefined
                };

            me.initMenu();

            return me;
        }($marketplaceWrap));


        oHosters = (function () {
            var me = {
                currentHoster: 'servint',
                loaded: false,
                XHR: undefined,
                modal: undefined,
                beforeLoad: function () {
                    me.loaded = false;
                    fnSetLoading(true);
                },
                afterLoad: function () {
                    me.loaded = true;
                    fnSetLoading(false);
                },
                load: function (oConfig) {

                    me.beforeLoad();

                    me = $.extend(me, oConfig);

                    if (!me.loaded && me.XHR) {
                        me.XHR.abort();
                    }

                    me.XHR = JApp.loadHosters(function (response) {

                        var oLoadedHosters = [];

                        $.each(response, function (index) {
                            if (this.keyword !== 'servint' && this.hasSignup === true) {
                                oLoadedHosters.push(this);
                            }
                        });

                        me.render(oLoadedHosters);
                    });




                    setTimeout(function () {
                        var loadFilter = getParameterByName('filter'),
                            loadPage = getParameterByName('mpage') || 1;

                        oCats.load(function () {
                            if (loadFilter) {
                                $('.cat-items .menu-item').each(function (index, item) {
                                    var currentParam = $(item).attr('data-filter').substring($(item).attr('data-filter').lastIndexOf('/') + 1);
                                    if (currentParam === loadFilter) {
                                        loadFilter = $(item).attr('data-filter');
                                        oCats.current = loadFilter;
                                        oCats.afterLoad();
                                    }
                                });
                            }

                            oApps.load(loadFilter, loadPage);

                        });

                        oCats.onChange = function (sCat) {
                            var oMsgCat = {};
                            oMsgCat[SET_CATEGORY_PM] = sCat;
                            oApps.load(sCat);
                        };

                        me.afterLoad();
                    }, 100)
                },
                render: function (hosters) {

                    var currentHosterIndex = -1;
                    $.each(hosters, function (index, hoster) {
                        if (hoster.keyword === me.currentHoster) {
                            currentHosterIndex = index;
                        }
                    });

                    if (currentHosterIndex != -1) {
                        hosters.splice(0, 0, hosters.splice(currentHosterIndex, 1)[0]);
                    }

                    sHtml = new EJS({url: sJsPAth + 'template/hosters.js?v=170823'}).render({
                        hosters: hosters,
                        text: JApp.text
                    });
                    $('body').append(sHtml);
                    me.modal = $('.signup_form_modal');

                    var $userMail = me.modal.find('#user_email'),
                        $modalForm = me.modal.find('.jlc-modal--form'),
                        $privacy = me.modal.find('input[type=checkbox]'),
                        $hosterDetail = me.modal.find('.show-info'),
                        TEXT_CHECK_EMAIL = JApp.text("txSuccess").replace("\\nr\\", '<br>'),
                        CSS_SHOW_INSTALLED_MSG = 'show',
                        CSS_ERROR = 'error';


                    // check terms and privacy
                    $privacy.change(function () {
                        if ($(this).is(':checked')) {
                            $('.jlc-form--submit').removeClass('submit-disabled').attr('disabled', false);
                        } else {
                            $('.jlc-form--submit').addClass('submit-disabled').attr('disabled', 'disabled');
                        }
                    });

                    $hosterDetail.click(function (e) {
                        e.preventDefault();

                        var sKey = $(this).attr('data-hoster');

                        var currentHosterIndex = -1;
                        $.each(hosters, function (index, hoster) {
                            if (hoster.keyword === sKey) {
                                currentHosterIndex = index;
                            }
                        });

                        sHtml = new EJS({url: sJsPAth + 'template/hoster.js?v=170823'}).render({
                            oHoster: hosters[currentHosterIndex],
                        });
                        $(me.modal).after(sHtml);
                        $('#hoster-data').css({opacity: 0, display: 'flex'}).animate({
                            opacity: 1
                        }, 500);

                        $('#hoster-data .jlc-modal--close').click(function (e) {
                            e.preventDefault();
                            $('#hoster-data').fadeOut();
                            setTimeout(function () {
                                $('#hoster-data').remove();
                            }, 500);
                        })


                    });

                    // modal form send
                    $modalForm.submit(function (e) {
                        e.preventDefault();

                        if ($(this).find('.submit-disabled').length) {
                            return false;
                        }

                        var customSignUp = me.modal.find("input[name='hoster']:checked").attr('data-custom-signup');
                        if (customSignUp) {
                            window.location.href = customSignUp;
                            return false;
                        }

                        var oUtils = JApp.utils,
                            oModal = oUtils.Modal,
                            sMsg,
                            sKey = me.modal.find("input[name='hoster']:checked").attr('data-key'),
                            sName = me.modal.find("input[name='hoster']:checked").val(),
                            $app = $('.marketplace-offer.details.show-form'),
                            $marketplace = $($app).closest('.form-is-shown'),
                            sAppid = $app.data('appid'),
                            $msgBlock = $app.find('.msg-block'),
                            $msgBlockText = $msgBlock.find('.text'),
                            JGA = JApp.GA,
                            data = {
                                email: $userMail.val(),
                                hoster: sKey,
                                lang: JApp.getLang(),
                                appid: sAppid,
                                group: window.group,
                            };

                        $modalForm.addClass(CSS_SHOW_LOADING).find('input[type=submit]').addClass('submit-disabled').attr('disabled', 'disabled');

                        var salesforceData = 'user_email=' + $userMail.val() + '&' + $(this).serialize();
                        if (salesforceData.indexOf('hoster') === -1) {
                            salesforceData += '&hoster=' + sKey;
                        }

                        JApp.InstallApp(data, function (response) {

                            var oResp = response.response,
                                result = oResp.result;

                            $modalForm.find('input[type=submit]').removeClass('submit-disabled').attr('disabled', false);

                            if (result === 0) {
                                sMsg = TEXT_CHECK_EMAIL;
                                JApp.TrackSalesforce(salesforceData);
                            } else {
                                if (result === 11002 || result === 501) {
                                    sMsg = JApp.text("txInvalidEmail");
                                } else if (result === 11000) {
                                    sMsg = JApp.text("txApplicationNotFound");
                                } else {
                                    sMsg = JApp.text("txError");
                                }
                                $msgBlock.addClass(CSS_ERROR);
                            }

                            $app.removeClass(CSS_SHOW_DETAIL).removeClass(CSS_SHOW_FORM);
                            $marketplace.removeClass(CSS_OVERLAY);
                            $msgBlockText.html(sMsg);
                            $msgBlock.addClass(CSS_SHOW_INSTALLED_MSG).css({opacity: 0, display: 'flex'}).animate({
                                opacity: 1
                            }, 1000);

                            $modalForm.removeClass(CSS_SHOW_LOADING);
                            JGA.trackInstallApp(sAppid, result);

                            $('.signup_form_modal').fadeOut().find('input[type=checkbox]').attr('checked', false).change();
                            $('body').removeClass('modal-open');
                        });

                        return false;
                    });

                }
            };

            return me;
        }());


        $.fn.mpOffer = function ($hostersSelect) {
            var oHoster = window.hoster,
                bIsTouch = Modernizr.touch,
                $wind = $(window),
                JGA = JApp.GA,

                EVENT_SHOW_HOSTER_PANEL = 'mpShowHosterts',
                TEXT_CHECK_EMAIL = JApp.text("txSuccess").replace("\\nr\\", '<br>');

            this.each(function () {
                var me = $(this),
                    marketplace = me.closest('.marketplace-offers'),
                    oData = me.data(),
                    bHoverBlocked = false,
                    sAppid = oData.appid,
                    bIsShownDetails = false,
                    AFTER_CLICK_TIMEOUT = 3000,
                    $defCont = me.find('.default-state'),
                    $descr = me.find('.description'),
                    $form = me.find('form'),
                    $email = me.find('input[name=email]'),
                    $btnInstall = me.find('.btn-install'),
                    $msgBlock = me.find('.msg-block'),
                    $msgBlockText = $msgBlock.find('.text'),
                    $msgBlockСlose = $msgBlock.find('.close-details'),
                    $close_details = me.find('.close-details'),
                    $popoverCont = me.find('.markeplace-popover-cnt'),
                    $modal = $('.signup_form_modal'),
                    $modalClose = $modal.find('.jlc-modal--close'),
                    $modal_email = $modal.find('#user_email'),

                    nTimeOutShown,
                    bIsActive = false,
                    fnCanHideDetails,
                    fnShowDetails,
                    fnHideModal,
                    fnHideForm,
                    fnShowForm,
                    fnHideDetails,
                    fnCalcPopoverSide,
                    fnInitPopoverDescr,

                    fnShowLoading,
                    fnHideLoading;

                fnShowLoading = function () {
                    me.addClass(CSS_SHOW_LOADING);
                };

                fnHideLoading = function () {
                    me.removeClass(CSS_SHOW_LOADING);
                };

                fnCanHideDetails = function () {
                    return !bIsActive;
                };

                fnCalcPopoverSide = function () {
                    var nWidth = me.width(),
                        nWindWidth = $wind.width(),
                        oOffset = me.offset(),
                        sPos = "right";

                    if (nWindWidth - oOffset.left - nWidth * 2 < 0) {
                        sPos = "left";
                    }

                    if (nWindWidth < nWidth * 2) {

                        // Use nWidth instead of height, it`s almost a square
                        if ($wind.height() - oOffset.top - nWidth * 2 > 0) {
                            sPos = "bottom";

                        } else {

                            sPos = "top";
                        }
                    }

                    return sPos;

                };

                fnInitPopoverDescr = function () {

                    $descr.popover({
                        trigger: 'hover',
                        delay: 300,
                        placement: fnCalcPopoverSide(),
                        html: true,
                        container: '#markeplace-popover-cnt-' + oData.index
                    });

                    $popoverCont.hover(function () {
                        fnHideDetails();
                    });
                };

                if (!bIsTouch) {
                    fnInitPopoverDescr();
                }


                fnShowDetails = function () {
                    if (bIsShownDetails === false && bHoverBlocked === false) {
                        nTimeOutShown = setTimeout(function () {
                            me.addClass(CSS_SHOW_DETAIL);
                            bIsShownDetails = true;
                        }, 0);
                    }
                };

                fnHideDetails = function (force) {
                    if (bHoverBlocked === false && (force === true || fnCanHideDetails())) {

                        if (bIsActive) {
                            fnHideForm();
                            bIsActive = false;
                        }

                        me.removeClass(CSS_SHOW_DETAIL);
                        bIsShownDetails = false;
                        clearTimeout(nTimeOutShown);
                    }
                };

                fnShowForm = function () {

                    bIsActive = true;
                    me.addClass(CSS_SHOW_FORM);
                    marketplace.addClass(CSS_OVERLAY);
                };

                fnHideForm = function () {
                    $email.popover('destroy');
                    me.removeClass(CSS_SHOW_FORM);
                    me.find('[name=email]').val('');
                    marketplace.removeClass(CSS_OVERLAY);
                };

                fnHideModal = function () {
                    $modal.fadeOut();
                    setTimeout(function () {
                        $('body').removeClass('modal-open');
                        $modal.find('input[type=checkbox]').attr('checked', false).change();
                        $modal.find('input[type=radio]').attr('checked', false).first().prop('checked', true);
                    }, 300);
                };

                $wind.on(EVENT_SHOW_HOSTER_PANEL, function (e, appid) {
                    if (appid !== sAppid && $msgBlock.hasClass(CSS_SHOW_INSTALLED_MSG)) {
                        bIsActive = false;
                        bHoverBlocked = false;
                        bIsShownDetails = false;

                        $msgBlock.fadeOut();
                        $msgBlock.removeClass(CSS_SHOW_INSTALLED_MSG).removeClass(CSS_ERROR);
                        $email.val('');

                    }
                    if (appid !== sAppid && me.hasClass(CSS_SHOW_DETAIL)) {
                        fnHideDetails(true);
                        bIsActive = false;
                    }
                });

                me.hover(fnShowDetails, fnHideDetails);

                $defCont.click(function () {
                    fnShowDetails();
                    setTimeout(fnHideDetails, AFTER_CLICK_TIMEOUT);
                });

                $('body').click(function(e){
                    if( !$('body').hasClass('modal-open') &&
                        (!$(e.target).hasClass('details-state') && !$(e.target).closest('.show-form').length)){
                        fnHideDetails(true);
                        marketplace.removeClass(CSS_OVERLAY);
                    }
                });

                $btnInstall.click(function () {
                    $modal_email.val($email.val());
                    JGA.trackSelectApp(sAppid);
                    $wind.trigger(EVENT_SHOW_HOSTER_PANEL, sAppid);

                    fnShowForm();


                    setTimeout(function () {
                        $email.focus();
                    }, 200);
                    return false;
                });

                $close_details.click(function (e) {
                    e.preventDefault();
                    fnHideDetails(true);
                });


                $($email).on('input', function (e) {
                    var oUtils = JApp.utils,
                        $modal_email = $('#user_email');

                    $modal_email.val($(this).val());

                    if (oUtils.isValidEmailStrong($modal_email.val())) {
                        $(this).closest('.install-panel').addClass('valid');
                    } else {
                        $(this).closest('.install-panel').removeClass('valid');
                    }
                });

                $msgBlockСlose.click(function () {
                    bIsActive = true;
                    bHoverBlocked = false;

                    $msgBlock.fadeOut();
                    setTimeout(function () {
                        $msgBlock.removeClass(CSS_SHOW_INSTALLED_MSG).removeClass(CSS_ERROR);
                        $email.val('');
                        fnHideDetails(true);
                    }, 500);


                    return false;
                });

                $modalClose.click(function () {
                    fnHideModal();
                });

                $form.submit(function () {

                    $form.addClass('loading');

                    var oUtils = JApp.utils,
                        oModal = oUtils.Modal,
                        sMsg,
                        sKey = window.hoster,
                        group = window.group,
                        $hosterLabel = me.find('.dropdown-menu a[data-hoster]'),
                        data = {
                            email: $email.val(),
                            hoster: sKey,
                            lang: JApp.getLang(),
                            appid: sAppid,
                            group: group
                        };

                    if (oUtils.isValidEmail(data.email)) {

                        if ($form.hasClass('open-modal')) {

                            var bodyRect = document.body.getBoundingClientRect(),
                                elemRect = this.getBoundingClientRect(),
                                offset = elemRect.top - bodyRect.top,
                                $modal_email = $('#user_email');


                            if (oUtils.isValidEmailStrong($modal_email.val())) {

                                $('body').addClass('modal-open');
                                $(this).closest('.marketplace-offer').addClass('loading');
                                $modal.find('.jlc-wrapper--modal').css('top', $(this).closest('.marketplace-offer').offset().top);
                                $modal.css({opacity: 0, display: 'flex'}).animate({
                                    opacity: 1
                                }, 1000);
                            } else {
                                oModal.show($email, {
                                    msg: JApp.text("txInvalidEmail"),
                                    position: 'top'
                                });
                            }
                            $(this).closest('.marketplace-offer').removeClass('loading');

                        } else {
                            fnShowLoading();
                            bHoverBlocked = true;

                            JApp.InstallApp(data, function (response) {

                                var oResp = response.response,
                                    result = oResp.result;

                                if (result === 0) {
                                    sMsg = TEXT_CHECK_EMAIL;

                                } else {
                                    if (result === 11002 || result === 501) {
                                        sMsg = JApp.text("txInvalidEmail");
                                    } else if (result === 11000) {
                                        sMsg = JApp.text("txApplicationNotFound");
                                    } else {
                                        sMsg = JApp.text("txError");
                                    }

                                    $msgBlock.addClass(CSS_ERROR);
                                }

                                $msgBlockText.html(sMsg);


                                $(me).removeClass(CSS_SHOW_DETAIL).removeClass(CSS_SHOW_FORM);
                                marketplace.removeClass(CSS_OVERLAY);
                                $msgBlock.addClass(CSS_SHOW_INSTALLED_MSG).css({opacity: 0, display: 'flex'}).animate({
                                    opacity: 1
                                }, 1000);


                                JGA.trackInstallApp(sAppid, result);

                                fnHideLoading();
                            });
                        }
                    } else {
                        oModal.show($email, {
                            msg: JApp.text("txInvalidEmail"),
                            position: 'top'
                        });
                    }

                    $form.removeClass('loading');

                    return false;
                });

            });

            return this;
        };

        JApp.marketplaceStore = (function (me) {

            var sMarketplaceAPI = JApp.marketplaceAPI;

            me.perPage = 9;

            me.getCatsURL = function () {
                return sMarketplaceAPI + "GetCategories";
            };

            me.getAppsURL = function () {
                return JApp.marketplaceAPI + "GetApps";
            };

            me.loadCat = function (fnCallback) {
                $.ajax({
                    type: "GET",
                    url: me.getCatsURL(),
                    data: {
                        lang: JApp.getLang()
                    },
                    async: true,
                    success: function (response) {

                        var oResp = jQuery.parseJSON(response) || {};

                        if (oResp.result == 0 && oResp.response) {
                            oResp = oResp.response;
                            for (var i = oResp.objects.length - 1; i--;) {
                                if (oResp.objects[i]['name'] === "apps/favorites") oResp.objects.splice(i, 1);
                            }

                            oResp.objects[oResp.objects.length] = {
                                name: 'addons',
                                index: oResp.objects[oResp.objects.length - 1]['index'] + 10000,
                                title: {
                                    en: 'Add-ons'
                                }
                            };

                        }

                        if (fnCallback) {
                            fnCallback(oResp);
                        }
                    }
                });
            };

            me.loadApps = function (fnCallback, sCat, nPage) {

                if (sCat == 'addons') {
                    var oSearchParams = {
                        count: me.perPage,
                        jpsType: 'update',
                        appstore: 1
                    };
                } else {
                    var oSearchParams = {
                        count: me.perPage,
                        category: sCat,
                        appstore: 1,
                        jpsType: 'install'
                    };
                }
                var oFilter = JApp.getFilter();


                if (oFilter) {
                    oFilter = JSON.parse(oFilter);
                    oSearchParams = Object.assign(oSearchParams, oFilter);
                    if (oFilter.app_id) {
                        $(JApp.Constants.MP_MENU_WRAP).hide();
                        $(JApp.Constants.MP_OFFERS_WRAP).addClass('marketplace-offers-filter');
                    }
                }

                if (nPage) {
                    oSearchParams.offset = me.perPage * (nPage - 1);
                }

                return $.ajax({
                    type: "GET",
                    url: me.getAppsURL(),
                    data: {
                        lang: JApp.getLang(),
                        search: JSON.stringify(oSearchParams)
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

            return me;

        }(JApp.marketplaceStore || {}));

    }());


});