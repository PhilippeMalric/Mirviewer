var printNom = function()
{
	svg.append("text")
	.attr("x",padgauche)
	.attr("y",hauteurNom)
    .attr("opacity",1)
	.style("font-weight", "bold")
    .text(info["gene"]["name"]+" : "+info["gene"]["percentile"] + "%(percentile), " + info["gene"]["quantity"] +" copies");

}