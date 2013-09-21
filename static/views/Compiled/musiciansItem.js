(function() {
    dust.register("musiciansItem", body_0);

    function body_0(chk, ctx) {
        return chk.write(" <li><a href=\"/musicians/").reference(ctx.get("id"), ctx, "h").write("\" data-ajax=\"false\">").helper("eq", ctx, {
            "else": body_1,
            "block": body_2
        }, {
            "key": body_3,
            "value": "default-image.jpg"
        }).write("<h1 class=\"myHeader\"> ").reference(ctx.get("artist_name"), ctx, "h").write(" </h1><h1 class=\"distance\">Distance: ").reference(ctx.get("distance"), ctx, "h").write(" MI from ").reference(ctx.get("locationName"), ctx, "h").write(" </h1><p class=\"myParagraph\">").reference(ctx.get("artist_instrument"), ctx, "h").write("</p></a></li>");
    }
    function body_1(chk, ctx) {
        return chk.write("<img src=\"http://testtones.colinulin.com/images/artist_pictures/artist_").reference(ctx.get("id"), ctx, "h").write(".jpg\" />");
    }
    function body_2(chk, ctx) {
        return chk.write("<img class=\"listViewThumb\" src=\"/img/musicians.png\" />");
    }
    function body_3(chk, ctx) {
        return chk.reference(ctx.get("artist_picture"), ctx, "h");
    }
    return body_0;
})();