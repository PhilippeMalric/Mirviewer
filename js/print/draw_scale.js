// permet de dessiner l'echelle au desus du mRna

var drawscale = function(){
	
	svg.append("line")
        .attr("x1", padgauche)
        .attr("y1", hauteurtickbar)
        .attr("x2", width+padgauche)
        .attr("y2", hauteurtickbar)
        .style("stroke", "#000")
        .style("stroke-width","2");
	
	tickbar();
	
}




var tickbar = function()
{
	
	var distanceEntreLesTcks = divisionJusteDuMrna();
	
	var taille = info["gene"]["length"];
	var distancecritique = Math.floor(taille / 20);
	
	for (var off =0 ; off <= taille-distancecritique ; off+= distanceEntreLesTcks)
    {
    	
            var posx = Math.floor(padgauche+off*pixelparnt);
           
            svg.append("line")
            .attr("x1", posx)
            .attr("y1", hauteurtickbar-hauteurtks)
            .attr("x2", posx)
            .attr("y2", hauteurtickbar+hauteurtks)
            .style("stroke", "#000")
            .style("stroke-width","1");
            
            var id ="" ;
            if(off>=1000) 
            	{
            	if(off%1000 == 0)
            		{id += (off/1000)+"K";
            		}
            	else{
            		id += (off/1000).toFixed(1)+"K";
            		}
            	}
            else  id = ""+off;
            
            svg.append("text")
            .attr("x", posx)
            .attr("y", hauteurtickbar-hauteurtks-5)
            .attr("fill", "#000")
            .text(id);
            
    }
	
	// derniere ligne
	
	svg.append("line")
    .attr("x1", width+padgauche)
    .attr("y1", hauteurtickbar-hauteurtks)
    .attr("x2", width+padgauche)
    .attr("y2", hauteurtickbar+hauteurtks)
    .style("stroke", "#000")
    .style("stroke-width","1");
	
	 svg.append("text")
     .attr("x", width+padgauche)
     .attr("y", hauteurtickbar-hauteurtks-5)
     .attr("fill", "#000")
	 .text(info["gene"]["length"]);
};



var divisionJusteDuMrna = function()
{
	var taille = info["gene"]["length"];
	var x = 16000;
	if(taille>x) return 4000;
	var timeout = 0;
	while (x>50 || timeOut > 20)
	{
		x/=2;
		
		if(taille>x) return Math.floor(x/4);
		
		timeout++;
	}
	
	//minimum 5
	
	return 5;
	
};

