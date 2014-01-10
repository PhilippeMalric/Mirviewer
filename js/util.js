//------------------------------------  ancienne implementation ( 9 couleurs differentes)
var assignColor1 = function(mirTab)
{
	
	var map ={};

	
	for(var mir in mirTab)
	{
		map[mirTab[mir]["name"]] = "#000"; 
	}
	
	
	
	
	var i = 0;
	
	for(var mir =0; mir < mirTab.length && i < 11; mir++)
	{
		if (map[mirTab[mir]["name"]] == "#000")
		{map[mirTab[mir]["name"]] = colorTab[i++];}
		
		mirTab[mir]["color"] = map[mirTab[mir]["name"]];
		
	}

}
//----------------------------------------------  
var assignColor = function(mirTab)
{
// -------------------------------- cree un gradient de couleur et l'associe a une valeur
	var color = d3.scale.linear()
		.domain([0.1, 1])
		.range(["blue", "red"]);

//---------------------------------- parcours le tableau de mir 
		
	for(var mir in mirTab)
	{
		if(mirTab[mir]["effectiveness"] < 0.1)
		{ mirTab[mir].color = "#000"; }
		else
		{
			mirTab[mir].color = color(mirTab[mir]["effectiveness"]);
		}
	}
		
}

var assignColorSum = function(mireff)
{
// -------------------------------- cree un gradient de couleur et l'associe a une valeur
	var color = d3.scale.linear()
		.domain([0.1,0.4,0.7, 1])
		.range(["blue","yellow","green", "red"]);

//---------------------------------- parcours le tableau de mir 
		
	for(var mir in mireff)
	{
		if(mireff[mir]["sum_effectiveness"] < 0.1)
		{ mireff[mir].color = "#000"; }
		else
		{
			mireff[mir].color = color(mireff[mir]["sum_effectiveness"]);
		}
	}
		
}


var assignRandomEff = function(mirTab)
{
	for(var mir in mirTab)
	{
			{mirTab[mir]["effectiveness"] = Math.pow(Math.random(),10);}
	
	}
}


var checkposition = function(mirTab)
{
	for(var mir in mirTab)
	{
		if(mirTab[mir]["position"] == undefined )
			{mirTab[mir]["position"] = Math.random()*info["gene"]["length"];}
	
	}
}

var iniligne = function(mirTab)
{
	for(var mir in mirTab)
	{
		mirTab[mir] = 0;
	
	}
}

var removeHsa = function()
{
	for(var mir in info.microrna)
	{
		info.microrna[mir].name = info.microrna[mir].name.substring(4, info.microrna[mir].name.length)
	}
}



/* tip */

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1e-6);


	

