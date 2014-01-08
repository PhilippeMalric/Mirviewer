var printMRna = function () {

	printNom();

    svg.append("rect")
        .attr("x", padgauche)
        .attr("y", hauteurGene)
        .attr("width", width)
        .attr("height", epaisseurGene)
        .style("fill", "#000")
        .style("stroke", "#000")
        .style("stroke-width", "1");

    var largeurReel = info["gene"]["cds_end"]*pixelparnt - info["gene"]["cds_start"]*pixelparnt+padgauche;
    var debutCds = info["gene"]["cds_start"]*pixelparnt+padgauche;
    
    svg.append("rect")
        .attr("x", debutCds)
        .attr("y", hauteurGene)
        .attr("width", largeurReel)
        .attr("height", epaisseurGene)
        .style("fill", "#898484")
        .style("stroke", "#898484")
        .style("stroke-width", "1");
};