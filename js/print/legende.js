var drawlegend = function (mirnaFin)
{
	// on ne place pas dans la legende ceux qui ont une effectiveness < 0.1
	var mireff = {};
	
	for (mir in info["microrna"])
	{
		var val = info["microrna"][mir]["sum_effectiveness"];
		if(val >= 0.1 && info["microrna"][mir][name] == undefined)
		{
			mireff[info["microrna"][mir][name]] = info["microrna"][mir];
		}
	}
	
	//--------------------------------------------------
	
	
	assignColorSum(mireff);
	
	var legendTab = new Array();
	
	
	
	var ligne = 0 ;
	var colonne = 0;
	
	var hauteurLigneTotal =0;
	var largeurLabelMax = 0;
	
	
	
	if(Object.keys(mireff).length == 0 )
		{
			finLegende = mirnaFin;
			console.log("tableau vide!!")
		}
	
	else
		{
		for(mir in mireff)
			{
				legendTab.push(new legElement(mireff[mir]));
			}
		
		
		// pour trouver le nombre de ligne dans la legende
	
	var maxLigne = legendTab.length;
	 
	if(maxLigne < 51)
	{
		var maxLigneT = maxLigne;
		
		for(var i = 2 ; maxLigneT>10 ;i++)
			{
				maxLigneT = maxLigne / i;
			}
		maxLigne = maxLigneT;
	}
	else
	{ maxLigne = 10;}
		
		maxy = 0 ;
		var maxyTemp = 0;
		
		for(mir in legendTab)
		{
		    
			if(ligne<maxLigne)
			{
				if(legendTab[mir].box.width > largeurLabelMax)
					{
						largeurLabelMax = legendTab[mir].box.width;
					}
				if(hauteurLigneTotal < ligne)
					{
					hauteurLigneTotal = ligne;
					}
				legendTab[mir].ligne = ligne++;
				legendTab[mir].colonne = colonne;
			}
			else
				{
					ligne = 0;
					largeurCol[colonne] = largeurLabelMax + grosseurHorinzonMirRect ;
					colonne++;
					largeurLabelMax = legendTab[mir].box.width;
					
					legendTab[mir].ligne = ligne++;
					legendTab[mir].colonne = colonne;
				}
			
			// pour connaitre la hauteur maximum d'une "case"
			if(legendTab[mir].box.heigth > grosseurVertMirRect)
		    {
		    	maxyTemp = legendTab[mir].box.heigth
		    }
			
		    else
	    	{
		    	maxyTemp = grosseurVertMirRect;
	    	}
		    
		    if(maxyTemp > maxy){
		    	maxy = maxyTemp;
		    }
		    
		}
		
		// pour etre sur d'avoir la largeur de la derniere colonne
		if(ligne != 0 )
			{
				largeurCol[colonne] = largeurLabelMax + grosseurHorinzonMirRect ;
			}
		//---------------------------------------------------------------
		//  dessine les element de la legende
		for(mir in legendTab)
			{
			legendTab[mir].draw(mirnaFin);
			}
	
	
	var width = grosseurHorinzonMirRect + GAP;
	for(var i in largeurCol)
		{
		width += largeurCol[i]+3*GAP;
		}
	
	var hauteur = (hauteurLigneTotal+1)*(maxy+GAP);
	
	

	printGradient(padgauche, mirnaFin,5*(maxy+GAP));
	
	 var cadre = svg.append("rect")
     .attr("x", padgauche + largeurGradient+GAP)
     .attr("y", mirnaFin )
     .attr("width", width)
     .attr("height", hauteur +GAP)
     .style("fill", "#000")
     .style("fill-opacity",0)
     .style("stroke", "#000")
     .style("stroke-width", "1");
	 
	 cadre.node().parentNode.insertBefore(cadre.node(),cadre.node().parentNode.firstChild);
	 
	
	 // pour pouvoir afficher la bulle dans la legende
	 
	 finLegende = mirnaFin + hauteur;
	 
	 
	}
	/* 	.attr("x", padgauche + grosseurHorinzonMirRect)
	    .attr("y", miArnFin + ligne * grosseurLigne)
	 */
	 
}




