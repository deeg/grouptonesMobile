(function() {
    dust.register("projectsItem", body_0);

    function body_0(chk, ctx) {
        return chk.write(" <li><a href=\"/projects/").reference(ctx.get("id"), ctx, "h").write("\"><img class=\"listViewThumb\" src=\"/img/projects.png\" /><h1 class=\"myHeader\"> ").reference(ctx.get("proj_name"), ctx, "h").write(" </h1><h3>").reference(ctx.get("artist_name"), ctx, "h").write("</h3><h5>Distance : ").reference(ctx.get("distance"), ctx, "h").write(" MI from ").reference(ctx.get("locationName"), ctx, "h").write("</h5></a></li>");
    }
    return body_0;
})();