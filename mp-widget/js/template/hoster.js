<div class="hoster_data_modal" id="hoster-data">
    <div class="modal-dialog">
        <div class="modal-content">
            <span class="jlc-modal--title">
                <%= oHoster.name %>
                <span class="jlc-modal--close" data-dismiss="modal"></span>
            </span>
            <div id="<%=oHoster.keyword%>-data" class="hoster-details">
            <div class="h-row">
                <div class="left">Support</div>
                <div class="right">
                    <% if (oHoster.support === 'new' || oHoster.support == 0) { %>
                        <i class="ico ico--new"></i>
                    <% } else { %>
                        <% var rating %>
                        <% if ((oHoster.support >= 1) && (oHoster.support <= 4)) { %>
                            <% rating = 1; %>
                        <% } else if ((oHoster.support >= 5) && (oHoster.support <= 9)) { %>
                            <% rating = 2; %>
                        <% } else if ((oHoster.support >= 10) && (oHoster.support <= 14)) { %>
                            <% rating = 3; %>
                        <% } else if ((oHoster.support >= 15) && (oHoster.support <= 17)) { %>
                            <% rating = 4; %>
                        <% } if ((oHoster.support >= 18) && (oHoster.support <= 20)) { %>
                            <% rating = 5; %>
                        <% } %>
                        <% for (var j = 0; j < 5; j++) { %>
                            <% var filled = '' %>
                            <% (j < rating) ? filled = 'filled' : filled = '' %>
                            <i class="ico ico--stars <%= filled %>"></i>
                        <% } %>
                    <% } %>
                </div>
            </div>
            <div class="h-row">
                <div class="left">
                    Perfomance
                </div>
                <div class="right">
                    <% for (var i = 0; i < 5; i++) { %>
                        <% var filled = '' %>
                        <% (i < Math.round(oHoster.performance)) ? filled = 'filled' : filled = '' %>
                        <i class="blue ico ico--stars <%= filled %>"></i>
                    <% } %>
                </div>
            </div>
            <div class="h-row">
                <div class="left">
                    Location
                </div>
                <div class="right regions-row">
                    <% var countries = window.jdata.countries; %>
                    <% var location = window.jdata.location; %>
                    <% delete oHoster.performanceRegions.general %>
                    <% if (Object.keys(oHoster.performanceRegions).length) {  %>
                        <% $.each(oHoster.performanceRegions, function(code, stars) { %>
                            <% var codes = code.split('-') %>
                            <% var additional = codes[1] %>
                            <% var code = codes[0] %>
                            <p>
                                <i class="flag flag-<%= code.toLowerCase() %>"></i>
                                <span class="right-part">
                                    <span class="location-rating"><%= Math.round(stars) %></span>
                                    <span class="location-country"><%= countries[code][0] %>
                                    <% if (additional) { %>
                                        <span class="location-additional">(<%= location[code][additional] %>)</span>
                                    <% } %>
                                    </span>
                                </span>
                            </p>
                        <% }); %>
                    <% } else { %>
                        <p>
                            <i class="flag flag-<%= oHoster.countryCode.toLowerCase() %>"></i>
                            <span class="right-part">
                            <span class="location-country"><%= oHoster.region %></span>
                            </span>
                        </p>
                    <% } %>
                </div>
            </div>
            <div class="h-row">
                <div class="left">Version</div>
                <div class="right"><%= oHoster.version %></div>
            </div>
            <div class="h-row">
                <div class="left">
                <a href="https://jelastic.cloud/details/<%= oHoster.keyword %>"
                target="_blank">Read more</a>
                </div>
            </div>
        </div>
    </div>
</div>