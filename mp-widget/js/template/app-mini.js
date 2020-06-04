<% for (i=0; i < apps.length; i++) { %>
    <% app = apps[i] %>
    <div class="freewall-cell mini-offer" data-index="<%=i%>">
    <div class="marketplace-offer" data-index="<%=i%>" data-appid="<%=app.app_id %>">
    <div class="msg-block">
    <span class="close-details"></span>
    <div class="sign"></div>
    <div class="text"><%=text("txSuccess")%></div>
    </div>
    <form class="install-panel <%= hoster ? '' : ' open-modal' %>">
    <a class="btn-install"><%=text("text")%></a>
        <input type="text" name="email" placeholder="<%=text("txEmailPlaceholder")%>" value=""/>
    <button type="submit" class="arrow-go"></button>
    </form>

    </div>
    </div>
    <%}%>
    <% if (pages.length > 1) { %>
        <div class="pagination-wrap">
        <table class="pagination">
        <tr>
        <% for (var i=0, oPage; oPage = pages[i]; i++) { %>
        <td>
        <% if (oPage.num) { %>
        <a class=" <% if(oPage.active) {%>active<%}%>" data-page="<%=oPage.num%>"><%=oPage.text%></a>
        <%} else {%>
            <span><%=oPage.text%></span>
            <%}%>
            </td>
            <%}%>
        </tr>
        </table>
    </div>
<%}%>
