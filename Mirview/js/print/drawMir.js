var drawMir = function (mirTab) {
    
    // pour savoir la position de la dernière ligne
    var ligneMax = 0;
   
    // pour tous les mir dans mirtab, on cacul la position en pixel, puis on regarde s'il y a chevauchement
    
    for (var mir in mirTab) {
        mirTab[mir]["positionRelative"] = Math.floor(padgauche +(pixelparnt * mirTab[mir]["position"])+grosseurHorinzonMirRect/2);
       
        mirTab[mir]["ligne"] = 1;
        
        // tant qu'il y a un chevauchement on descend d'une ligne
        while (checkChevauchement(mirTab[mir])) {
            mirTab[mir]["ligne"]++;
        }
        
        
        mirTab[mir]["rect"] = new MiRectangle(mirTab[mir]["ligne"], mirTab[mir]["positionRelative"], mirTab[mir]["color"], mirTab[mir]["quantity"], mirTab[mir]["name"],mirTab[mir]["position"],mirTab[mir]["number"],mirTab[mir]["effectiveness"]);
        mirTab[mir]["rect"].draw();
        if (mirTab[mir]["ligne"] > ligneMax) ligneMax = mirTab[mir]["ligne"];

        
        var mirnaFin = GAP + hauteurDebutMir  + (grosseurVertMirRect + GAP) * ligneMax ;
    }
	console.log("ligneMax : " + ligneMax);
	
	return mirnaFin;
	
};


//---------------------------------------------------------------------
var checkChevauchement = function (mir) {
    posMiAComparer = mir["positionRelative"];
    ligneMiAComparer = mir["ligne"];
    nomMiAComparer = mir["name"];

    for (var mi in info["microrna"]) {
        nomMiTest = info["microrna"][mi]["name"];
        posMiTest = info["microrna"][mi]["positionRelative"];
        ligneMiTest = info["microrna"][mi]["ligne"];

        if (!(posMiTest == posMiAComparer && nomMiAComparer == nomMiTest)) // pour ne pas comparer le mir a lui-meme
		{
            if (ligneMiAComparer !== 0) // compare seulement ceux qui on deja ete placez
			{
                if (posMiTest-1 > posMiAComparer) // limite gauche
				{
                    if (posMiTest-1 < posMiAComparer + grosseurHorinzonMirRect) if (ligneMiTest == ligneMiAComparer) return true;
                } else if (posMiTest+1 > posMiAComparer - grosseurHorinzonMirRect) if (ligneMiTest == ligneMiAComparer) return true;
            }
        }
    } //-------------------------------------------- fin de la loop
    return false;
};