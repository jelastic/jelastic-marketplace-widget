<div class="signup_form_modal" id="publicModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <span class="jlc-modal--title">Choose Service Provider to Install Application <span
                class="jlc-modal--close" data-dismiss="modal"></span></span>
            <form class="jlc-modal--form" action="#" data-hoster-criteria="hostersCriteria5e2093b6cfff9">
                <input type="hidden" id="user_email" value="" readOnly="">
                    <div class="hosters-grid">
                        <% for (var i = 0, oHoster; oHoster = hosters[i]; i++) { %>
                        <% if(!oHoster.customSignUp) { %>
                        <% if(oHoster.trial !== false) { %>

                        <div class="hoster">
                            <div>
                                <input <%= i == 0 ? 'checked' : '' %> id="radio-<%=oHoster.keyword%>" type="radio" name="hoster" value="<%=oHoster.keyword%>" data-hoster-href="<%=oHoster.href%>" data-val="<%=oHoster.keyword%>" data-nm="<%=oHoster.name%>" data-lcn="<%=oHoster.region%>" data-custom-signup="<%=oHoster.customSignUp%>" data-site="" data-id="0" title="<%=oHoster.name%>" data-key="<%=oHoster.key%>">
                            <label for="radio-<%=oHoster.keyword%>">
                            <a href="#" class="show-info" data-hoster="<%=oHoster.keyword%>"
                            title="About <%=oHoster.name%>">i</a>
                            <span class="logo-wrapper">
                            <img src="<%= oHoster.logo %>"
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



                            <% } %>
                            <% } %>
                            <% } %>


                    </div>
                    <div class="gradient-line"></div>
                    <div class="additional-fields">
                        <div class="field-wrapper">
                            <input type="text" name="firstName" required placeholder="First Name *" value="">
                        </div>
                        <div class="field-wrapper">
                            <input type="text" name="lastName" required value="" placeholder="Last Name *">
                        </div>
                        <div class="field-wrapper">
                            <input type="text" name="company" required placeholder="Company *" value="">
                        </div>
                        <div class="field-wrapper">
                            <select name="country" required>
                                <option value="" selected="selected">Country *</option>
                                <option value="1311030">United States</option>
                                <option value="1311032">Canada</option>
                                <option value="1311034">Afghanistan</option>
                                <option value="1311036">Aland</option>
                                <option value="1311038">Albania</option>
                                <option value="1311040">Algeria</option>
                                <option value="1311042">American Samoa</option>
                                <option value="1311044">Andorra</option>
                                <option value="1311046">Angola</option>
                                <option value="1311048">Anguilla</option>
                                <option value="1311050">Antarctica</option>
                                <option value="1311052">Antigua and Barbuda</option>
                                <option value="1311054">Argentina</option>
                                <option value="1311056">Armenia</option>
                                <option value="1311058">Aruba</option>
                                <option value="1311060">Ascension</option>
                                <option value="1311062">Australia</option>
                                <option value="1311064">Austria</option>
                                <option value="1311066">Azerbaijan</option>
                                <option value="1311068">Bahamas</option>
                                <option value="1311070">Bahrain</option>
                                <option value="1311072">Bangladesh</option>
                                <option value="1311074">Barbados</option>
                                <option value="1311076">Belarus</option>
                                <option value="1311078">Belgium</option>
                                <option value="1311080">Belize</option>
                                <option value="1311082">Benin</option>
                                <option value="1311084">Bermuda</option>
                                <option value="1311086">Bhutan</option>
                                <option value="1311088">Bolivia</option>
                                <option value="1311090">Bosnia and Herzegovina</option>
                                <option value="1311092">Botswana</option>
                                <option value="1311094">Bouvet Island</option>
                                <option value="1311096">Br. Indian Ocean Territory</option>
                                <option value="1311098">Brazil</option>
                                <option value="1311100">British Virgin Islands</option>
                                <option value="1311102">Brunei</option>
                                <option value="1311104">Bulgaria</option>
                                <option value="1311106">Burkina Faso</option>
                                <option value="1311108">Burundi</option>
                                <option value="1311110">Cambodia</option>
                                <option value="1311112">Cameroon</option>
                                <option value="1311114">Cape Verde</option>
                                <option value="1311116">Cayman Islands</option>
                                <option value="1311118">Central African Republic</option>
                                <option value="1311120">Chad</option>
                                <option value="1311122">Chile</option>
                                <option value="1311124">China</option>
                                <option value="1311126">Christmas Island</option>
                                <option value="1311128">Cocos (Keeling) Islands</option>
                                <option value="1311130">Colombia</option>
                                <option value="1311132">Comoros</option>
                                <option value="1311134">Cook Islands</option>
                                <option value="1311136">Costa Rica</option>
                                <option value="1311138">Croatia</option>
                                <option value="1311140">Curacao</option>
                                <option value="1311142">Cyprus</option>
                                <option value="1311144">Czech Republic</option>
                                <option value="1311146">Democratic Republic of Congo</option>
                                <option value="1311148">Denmark</option>
                                <option value="1311150">Djibouti</option>
                                <option value="1311152">Dominica</option>
                                <option value="1311154">Dominican Republic</option>
                                <option value="1311156">Ecuador</option>
                                <option value="1311158">Egypt</option>
                                <option value="1311160">El Salvador</option>
                                <option value="1311162">Equatorial Guinea</option>
                                <option value="1311164">Eritrea</option>
                                <option value="1311166">Estonia</option>
                                <option value="1311168">Ethiopia</option>
                                <option value="1311170">Falkland Islands</option>
                                <option value="1311172">Faroe Islands</option>
                                <option value="1311174">Fiji</option>
                                <option value="1311176">Finland</option>
                                <option value="1311178">France</option>
                                <option value="1311180">French Guiana</option>
                                <option value="1311182">French Polynesia</option>
                                <option value="1311184">French Southern Territories</option>
                                <option value="1311186">Gabon</option>
                                <option value="1311188">Gambia</option>
                                <option value="1311190">Georgia</option>
                                <option value="1311192">Germany</option>
                                <option value="1311194">Ghana</option>
                                <option value="1311196">Gibraltar</option>
                                <option value="1311198">Greece</option>
                                <option value="1311200">Greenland</option>
                                <option value="1311202">Grenada</option>
                                <option value="1311204">Guadeloupe</option>
                                <option value="1311206">Guam</option>
                                <option value="1311208">Guatemala</option>
                                <option value="1311210">Guernsey</option>
                                <option value="1311212">Guinea</option>
                                <option value="1311214">Guinea-Bissau</option>
                                <option value="1311216">Guyana</option>
                                <option value="1311218">Haiti</option>
                                <option value="1311220">Heard and McDonald Islands</option>
                                <option value="1311222">Honduras</option>
                                <option value="1311224">Hong Kong S.A.R., China</option>
                                <option value="1311226">Hungary</option>
                                <option value="1311228">Iceland</option>
                                <option value="1311230">India</option>
                                <option value="1311232">Indonesia</option>
                                <option value="1311234">Ireland</option>
                                <option value="1311236">Isle of Man</option>
                                <option value="1311238">Israel</option>
                                <option value="1311240">Italy</option>
                                <option value="1311242">Jamaica</option>
                                <option value="1311244">Japan</option>
                                <option value="1311246">Jersey</option>
                                <option value="1311248">Jordan</option>
                                <option value="1311250">Kazakhstan</option>
                                <option value="1311252">Kenya</option>
                                <option value="1311254">Kiribati</option>
                                <option value="1311256">Kuwait</option>
                                <option value="1311258">Kyrgyzstan</option>
                                <option value="1311260">Laos</option>
                                <option value="1311262">Latvia</option>
                                <option value="1311264">Lebanon</option>
                                <option value="1311266">Lesotho</option>
                                <option value="1311268">Libya</option>
                                <option value="1311270">Liechtenstein</option>
                                <option value="1311272">Lithuania</option>
                                <option value="1311274">Luxembourg</option>
                                <option value="1311276">Macau</option>
                                <option value="1311278">Macedonia</option>
                                <option value="1311280">Madagascar</option>
                                <option value="1311282">Malawi</option>
                                <option value="1311284">Malaysia</option>
                                <option value="1311286">Maldives</option>
                                <option value="1311288">Mali</option>
                                <option value="1311290">Malta</option>
                                <option value="1311292">Marshall Islands</option>
                                <option value="1311294">Martinique</option>
                                <option value="1311296">Mauritania</option>
                                <option value="1311298">Mauritius</option>
                                <option value="1311300">Mayotte</option>
                                <option value="1311302">Mexico</option>
                                <option value="1311304">Micronesia</option>
                                <option value="1311306">Moldova</option>
                                <option value="1311308">Monaco</option>
                                <option value="1311310">Mongolia</option>
                                <option value="1311312">Montenegro</option>
                                <option value="1311314">Montserrat</option>
                                <option value="1311316">Morocco</option>
                                <option value="1311318">Mozambique</option>
                                <option value="1311320">Myanmar (Burma)</option>
                                <option value="1311322">Namibia</option>
                                <option value="1311324">Nauru</option>
                                <option value="1311326">Nepal</option>
                                <option value="1311328">Netherlands</option>
                                <option value="1311330">Netherlands Antilles</option>
                                <option value="1311332">New Caledonia</option>
                                <option value="1311334">New Zealand</option>
                                <option value="1311336">Nicaragua</option>
                                <option value="1311338">Niger</option>
                                <option value="1311340">Nigeria</option>
                                <option value="1311342">Niue</option>
                                <option value="1311344">Norfolk Island</option>
                                <option value="1311346">Northern Mariana Islands</option>
                                <option value="1311348">Norway</option>
                                <option value="1311350">Oman</option>
                                <option value="1311352">Pakistan</option>
                                <option value="1311354">Palau</option>
                                <option value="1311356">Palestinian Territory</option>
                                <option value="1311358">Panama</option>
                                <option value="1311360">Papua New Guinea</option>
                                <option value="1311362">Paraguay</option>
                                <option value="1311364">Peru</option>
                                <option value="1311366">Philippines</option>
                                <option value="1311368">Pitcairn Islands</option>
                                <option value="1311370">Poland</option>
                                <option value="1311372">Portugal</option>
                                <option value="1311374">Puerto Rico</option>
                                <option value="1311376">Qatar</option>
                                <option value="1311378">Reunion</option>
                                <option value="1311380">Romania</option>
                                <option value="1311382">Russia</option>
                                <option value="1311384">Rwanda</option>
                                <option value="1311386">Saint Barthelemy</option>
                                <option value="1311388">Saint Helena</option>
                                <option value="1311390">Saint Kitts and Nevis</option>
                                <option value="1311392">Saint Lucia</option>
                                <option value="1311394">Saint Martin</option>
                                <option value="1311396">Saint Pierre and Miquelon</option>
                                <option value="1311398">Saint Vincent and Grenadines</option>
                                <option value="1311400">Samoa</option>
                                <option value="1311402">San Marino</option>
                                <option value="1311404">Sao Tome and Principe</option>
                                <option value="1311406">Saudi Arabia</option>
                                <option value="1311408">Senegal</option>
                                <option value="1311410">Serbia</option>
                                <option value="1311412">Seychelles</option>
                                <option value="1311414">S Georgia S Sandwich Islands</option>
                                <option value="1311416">Sierra Leone</option>
                                <option value="1311418">Singapore</option>
                                <option value="1311420">Sint Maarten</option>
                                <option value="1311422">Slovakia</option>
                                <option value="1311424">Slovenia</option>
                                <option value="1311426">Solomon Islands</option>
                                <option value="1311428">Somalia</option>
                                <option value="1311430">South Africa</option>
                                <option value="1311432">South Korea</option>
                                <option value="1311434">South Sudan</option>
                                <option value="1311436">Spain</option>
                                <option value="1311438">Sri Lanka</option>
                                <option value="1311440">Suriname</option>
                                <option value="1311442">Svalbard</option>
                                <option value="1311444">Swaziland</option>
                                <option value="1311446">Sweden</option>
                                <option value="1311448">Switzerland</option>
                                <option value="1311450">Taiwan</option>
                                <option value="1311452">Tajikistan</option>
                                <option value="1311454">Tanzania</option>
                                <option value="1311456">Thailand</option>
                                <option value="1311458">Timor-Leste (East Timor)</option>
                                <option value="1311460">Togo</option>
                                <option value="1311462">Tokelau</option>
                                <option value="1311464">Tonga</option>
                                <option value="1311466">Trinidad and Tobago</option>
                                <option value="1311468">Tristan da Cunha</option>
                                <option value="1311470">Tunisia</option>
                                <option value="1311472">Turkey</option>
                                <option value="1311474">Turkmenistan</option>
                                <option value="1311476">Turks and Caicos Islands</option>
                                <option value="1311478">Tuvalu</option>
                                <option value="1311480">U.S. Minor Outlying Islands</option>
                                <option value="1311482">U.S. Virgin Islands</option>
                                <option value="1311484">Uganda</option>
                                <option value="1311486">Ukraine</option>
                                <option value="1311488">United Arab Emirates</option>
                                <option value="1311490">United Kingdom</option>
                                <option value="1311492">Uruguay</option>
                                <option value="1311494">Uzbekistan</option>
                                <option value="1311496">Vanuatu</option>
                                <option value="1311498">Vatican City</option>
                                <option value="1311500">Venezuela</option>
                                <option value="1311502">Viet Nam</option>
                                <option value="1311504">Wallis and Futuna</option>
                                <option value="1311506">Western Sahara</option>
                                <option value="1311508">Yemen</option>
                                <option value="1311510">Zambia</option>
                                <option value="1311512">Unknown</option>
                            </select>
                        </div>
                    </div>
                    <div class="jlc-gdpr--checkbox">
                        <label>
                            <input type="checkbox">
                        <span>I read and agree to <a href="https://www.virtuozzo.com/legal/terms-and-conditions/" target="_blank">Virtuozzo Terms of Use </a>and <a
                            href="https://www.virtuozzo.com/legal/privacy-policy/" target="_blank">Privacy Policy</a><span data-error-target="1"><span
                            class="gfield_required">*</span></span>
                        </span>
                        </label>
                    </div>
                    <input type="submit" value="<%= text('text') %>" class="jlc-form--submit submit-disabled" disabled>
            </form>
        </div>
    </div>
</div>


