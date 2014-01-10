var printGradient = function(x, y, hauteurG)
{
var gradient = svg.append("linearGradient")
    .attr("id", "gradient")
    .attr("y1", "0%")
    .attr("y2", "100%")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("gradientUnits", "objectBoundingBox");

gradient.append("stop")
    .attr("offset", "0")
    .attr("stop-color", "red")
	.attr("stop-opacity","1");
	

gradient.append("stop")
    .attr("offset", "0.3")
    .attr("stop-color", "yellow")
	.attr("stop-opacity","1");

gradient.append("stop")
    .attr("offset", "0.6")
    .attr("stop-color", "green")
	.attr("stop-opacity","1");	
	
gradient.append("stop")
    .attr("offset", "0.90")
    .attr("stop-color", "blue")
	.attr("stop-opacity","1");

gradient.append("stop")
    .attr("offset", "1")
    .attr("stop-color", "#000")
	.attr("stop-opacity","1");

	
svg.append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("width", "10")
    .attr("height", hauteurG)
    .attr("fill", "url(#gradient)");
}