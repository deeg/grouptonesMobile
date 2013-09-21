(function() {
    dust.register("eventsItem", body_0);

    function body_0(chk, ctx) {
        return chk.write("<li><a href=\"/events/").reference(ctx.get("id"), ctx, "h").write("\"><img class=\"listViewThumb\" src=\"/img/events.png\" /><h1 class=\"myHeader\"> ").reference(ctx.get("event_name"), ctx, "h").write(" </h1><p class=\"myParagraph\">").reference(ctx.get("event_venue"), ctx, "h").write("</p><p class=\"myParagraph\">").helper("dateFormatter", ctx, {}, {
            "uglyDate": body_1
        }).write("</p><p class=\"myParagraph\">Distance: ").reference(ctx.get("distance"), ctx, "h").write(" MI from ").reference(ctx.get("locationName"), ctx, "h").write("</p></a></li>");
    }
    function body_1(chk, ctx) {
        return chk.reference(ctx.get("event_start"), ctx, "h");
    }
    return body_0;
})();