(function($) {
    $.fn.jeCarousel = function (fOnCurrentChanged, nMaxWidth) {

        var me = this,
            sActiveCls = 'je-carousel-active',
            sOverCls = 'je-carousel-over',
            sAttrPrefix = 'data-',
            sNameAttr = sAttrPrefix + 'nm',
            sValueAttr = sAttrPrefix + 'val',
            sLcnAttr = sAttrPrefix + 'lcn',
            aCarousels = [];

        (function () {
            me.find('img').each(function () {
                $('<img/>').attr('src', $(this).attr('src'));
            });
        }());

        this.each(function () {
            var $t = $(this),
                $view = $t.find('.je-carousel-view'),
                $ul = $t.find('.je-carousel-list'),
                $currentBg = $t.find('.je-carousel-current-bg'),
                $items,
                nLength,
                nLeft,
                nItemWidth,
                nFakeCount,
                bDisabled = false,
                oData = {},
                oFakeData = {},
                oItemData = {},
                i,
                t;

            function setDisabled (value) {
                bDisabled = value;
            }

            function toggleTo(value, bFake, anim) {
                var nDelta = 0,
                    nViewWidth = $view.width(),
                    $active,
                    tmp,
                    data;

                anim = anim !== false;

                if (tmp = oData[value]) {

                    $active = $ul.find('.' + sActiveCls);
                    data = bFake ? oFakeData : oData;

                    $ul.stop(true);

                    nDelta = (nViewWidth -  nItemWidth) / 2;
                    nDelta = Math.floor(nDelta);

                    if ($active.length) {
                        $ul.css('left', nDelta - data[$active.attr(sValueAttr)].index * nItemWidth);
                        $active.removeClass(sActiveCls);
                    }

                    tmp.el.addClass(sActiveCls);

                    $ul.animate({
                        left : nDelta - tmp.index * nItemWidth
                    }, {
                        duration    : anim ? 175 : 0
                    });
                    if (fOnCurrentChanged) {
                        fOnCurrentChanged(value, tmp.name, tmp.location);
                    }
                }
            }

            $items = $ul.find('li');
            nLength = $items.length;
            nItemWidth = $items.width();
            nMaxWidth = nMaxWidth || $view.width();

            nLeft = nMaxWidth / 2 - /*$currentBg.width()*/nItemWidth / 2;
            // $currentBg.css('left', nLeft);

            nFakeCount = Math.ceil(nLeft / nItemWidth) + 1;
            nFakeCount = Math.min(nLength, nFakeCount);
            for (i = 0; i < nFakeCount; i++) {
                t = $($items.get(nLength - i - 1)).clone().addClass('fake').removeClass(sActiveCls);
                $ul.prepend(t);

                t = $($items.get(i)).clone().addClass('fake').removeClass(sActiveCls);
                $ul.append(t);
            }

            $items = $ul.find('li');
            nLength = $items.length;

            if (nLength) {
                $ul.width(nItemWidth * nLength);
            }

            $items.each(function (index) {
                var $li = $(this),
                    nTargetLeft = nLeft - $li.position().left,
                    value = $li.attr(sValueAttr),
                    name = $li.attr(sNameAttr),
                    location = $li.attr(sLcnAttr),
                    bFake = $li.hasClass('fake');

                oItemData[index] = {
                    value   : value,
                    fake    : bFake
                };

                if (!bFake) {
                    oData[value] = {
                        el      : $li,
                        left    : nTargetLeft,
                        name    : name,
                        location: location,
                        index   : index
                    };
                } else {
                    oFakeData[value] = {
                        el      : $li,
                        left    : nTargetLeft,
                        index   : index
                    };
                }

                $li.hover(
                    function () {
                        var $t = $(this);
                        $t.addClass(sOverCls);
                    },
                    function () {
                        var $t = $(this);
                        $t.removeClass(sOverCls);
                    }
                );

                $li.click(function () {
                    if (!bDisabled) {
                        toggleTo(value, bFake);
                    }
                });
            });

            t = $ul.find('.' + sActiveCls);
            if (t.length) {
                $ul.css('left', oData[t.attr(sValueAttr)].left);
            }

            $t.find('.je-carousel-prev,.je-carousel-next').hover(
                function () {
                    var $t = $(this);
                    $t.addClass(sOverCls);
                },
                function () {
                    var $t = $(this);
                    $t.removeClass(sOverCls);
                }
            ).jeMousehold();


            $t.find('.je-carousel-prev').mousedown(function () {
                var index = $items.index($ul.find('.' + sActiveCls)) - 1,
                    tmp;

                if (!bDisabled) {

                    if (index < 0) {
                        index = nLength - 1;
                    }

                    tmp = oItemData[index];
                    if (tmp) {
                        toggleTo(tmp.value, tmp.fake);
                    }
                }
            });


            $t.find('.je-carousel-next').mousedown(function () {
                var index = $items.index($ul.find('.' + sActiveCls)) + 1,
                    tmp;

                if (!bDisabled) {
                    if (index >= nLength) {
                        index = 0;
                    }

                    tmp = oItemData[index];
                    if (tmp) {
                        toggleTo(tmp.value, tmp.fake);
                    }
                }
            });

            aCarousels.push({
                setCurrent : function (value, anim) {
                    toggleTo(value, false, anim);
                },
                setDisabled : function (value) {
                    setDisabled(value);
                }
            });
        });

        return aCarousels;
    };

}(jQuery));