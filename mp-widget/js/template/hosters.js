<div class="signup_form_modal" id="publicModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <span class="jlc-modal--title">Choose Service Provider to Install Application <span
                class="jlc-modal--close" data-dismiss="modal"></span></span>
            <form class="jlc-modal--form" action="#" data-hoster-criteria="hostersCriteria5e2093b6cfff9">
                <input type="hidden" id="user_email" value="" readOnly="">
                    <div class="hosters-grid">
                        <% for (var i = 0, oHoster; oHoster = hosters[i]; i++) { %>


                        <div class="hoster">
                            <div>
                                <input <%= i == 0 ? 'checked' : '' %> id="radio-<%=oHoster.keyword%>" type="radio" name="hoster" value="<%=oHoster.keyword%>" data-hoster-href="<%=oHoster.href%>" data-val="<%=oHoster.keyword%>" data-nm="<%=oHoster.name%>" data-lcn="<%=oHoster.region%>" data-custom-signup="" data-site="" data-id="0" title="<%=oHoster.name%>" data-key="<%=oHoster.key%>">
                            <label for="radio-<%=oHoster.keyword%>">
                            <a href="#" class="show-info" data-hoster="<%=oHoster.keyword%>"
                            title="About <%=oHoster.name%>">i</a>
                            <span class="logo-wrapper">
                            <img src="//jelastic.com/wp-content/themes/salient/img/hosters/hosters_signin/<%=oHoster.keyword%>.png"
                            alt="<%=oHoster.name%>">
                            </span>
                            <span class="hoster-regions">

                                <% delete oHoster.performanceRegions.general %>
                                <% if (Object.keys(oHoster.performanceRegions).length) {  %>
                                    <% var out = [] %>

                                    <% var j = 0; %>
                                    <% $.each(oHoster.performanceRegions, function(code, stars) { %>
                                        <% var codes = code.split('-') %>
                                        <% var code = codes[0] %>
                                        <% var flag = out.indexOf(code) %>
                                        <% if (flag < 0) { %>
                                            <% out[j] = code %>
                                            <% j++; %>
                                        <% } %>
                                    <%  }); %>



                                    <% $.each(out, function(index, code) { %>
                                        <i class="flag flag-<%= code.toLowerCase() %>"><%= code.toLowerCase() %></i>
                                    <% }); %>

                                <% } else { %>
                                    <i class="flag flag-<%= oHoster.countryCode.toLowerCase() %>"><%=oHoster.countryCode.toLowerCase()%></i>
                                <% } %>

                            </span>
                            </label>

                            </div>
                        </div>



                            <%} %>


                    </div>
                    <div class="gradient-line"></div>
                    <div class="jlc-gdpr--checkbox">
                        <label>
                            <input type="checkbox">
                        <span>I read and agree to <a href="https://jelastic.com/terms/">Jelastic Terms of Use </a>and <a
                            href="https://jelastic.com/policy/">Privacy Policy</a><span data-error-target="1"><span
                            class="gfield_required">*</span></span>
                        </span>
                        </label>
                    </div>
                    <input type="submit" value="<%= text('text') %>" class="jlc-form--submit submit-disabled" disabled>
            </form>
        </div>
    </div>
</div>


