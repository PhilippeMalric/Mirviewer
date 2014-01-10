/*
 * File:        mirviewer.js
 * Author:      Stephen Leong Koan
 * Forked from: Philippe Malric's Mirviewer project https://github.com/PhilippeMalric/Mirviewer
 *
 * Copyright (C) 2011, 2012, 2013, 2014 Université de Montréal.
 *
 * This file is used by the mirbook pages
 */

/* CONSTANTS */
var iWIDTH = 1000, iSPACING = 3, iGAP = 10, iLEFT_PADDING = 15;

// gene
var iGENE_Y = 50, iGENE_HEIGHT = 5, iNAME_Y = 15;

// microrna
var iMICRORNA_HEIGHT = 5, iMICRORNA_WIDTH = 5;
iINITIAL_MICRORNA_Y = iGENE_Y + iGENE_HEIGHT + iSPACING;

// scale
var iSCALE_Y = iGENE_Y - 5, iSCALE_HEIGHT = 3;

// Gradient in the legend
var iGRADIENT_WIDTH = 10;
var aCOLOR = ["#4DAF4A", "#984EA3", "#FF7F00", "#A65628", "#F781BF", "#999999"];
var iLEGEND_LAST_POS = 0, iLEGEND_MAX_HEIGHT;

// map in which the IDs of the clicked objects are stored
var mCLICKED = {};
var aCOLUMN_WIDTH = [];

var SVG = d3.select("body").append("div").attr("class", "outer").append("class", "inner").append("svg");

var iNT_WIDTH = iWIDTH / mDATA["gene"]["length"];

var DIV = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 1e-6);

$(function() {
    SVG.attr("width", window.innerWidth)
       .attr("height", window.innerHeight);

    assign_color(mDATA["microrna"], "effectiveness");

    draw_gene();

    var iMICRORNA_LAST_POS = draw_microrna(info["microrna"]);
    draw_scale();

    draw_legend(iMICRORNA_LAST_POS);

    SVG.append("line")
       .attr("x1", iLEFT_PADDING)
       .attr("y1", iLEGEND_LAST_POS)
       .attr("x2", iWIDTH + iLEFT_PADDING)
       .attr("y2", iLEGEND_LAST_POS);
});

function assign_color(mirTab, effKey) {
    // Generate a gradient range
    var color = d3.scale.linear().domain([0.1, 1]).range(["blue", "red"]);

    // Associate a color to each microrna according to the gradient
    for (var mir in mirTab) {
        if (mirTab[mir][effKey] < 0.1) {
            mirTab[mir].color = "#000";
        } else {
            mirTab[mir].color = color(mirTab[mir][effKey]);
        }
    }

}

function draw_legend(mirnaFin){
    // The microrna with eff < 0.1 are not displayed in the legend
    var filtered_microrna = {};
    for (mir in mDATA["microrna"]) {
        var val = mDATA["microrna"][mir]["sum_effectiveness"];
        if (val >= 0.1 && mDATA["microrna"][mir]["name"] == undefined) {
            filtered_microrna[mDATA["microrna"][mir]["name"]] = mDATA["microrna"][mir];
        }
    }

    assign_color(filtered_microrna, "sum_effectiveness");

    var legend_array = [];

    var row = 0;
    var col = 0;

    var total_row_height = 0;
    var max_label_width = 0;

    if (Object.keys(filtered_microrna).length == 0) {
        iLEGEND_LAST_POS = iMICRORNA_LAST_POS;
    } else {
        for (mir in filtered_microrna) {
            legend_array.push(new LegendElement(filtered_microrna[mir]));
        }

        // find the number of rows in the legend
        var max_row = legend_array.length;

        if (max_row < 51) {
            var temp_max_row = max_row;
            for (var i = 2; temp_max_row > 10; i++) {
                temp_max_row = max_row / i;
            }
            max_row = temp_max_row;
        } else {
            max_row = 10;
        }

        iLEGEND_MAX_HEIGHT = 0;
        var temp_max_height = 0;

        for (mir in legend_array) {
            if (row < max_row) {
                if (legend_array[mir].box.width > max_label_width) {
                    max_label_width = legend_array[mir].box.width;
                }
                if (total_row_height < row) {
                    total_row_height = row;
                }
                legend_array[mir].row = row++;
                legend_array[mir].col = col;
            } else {
                row = 0;
                aCOLUMN_WIDTH[col] = max_label_width + iMICRORNA_WIDTH;
                col++;
                max_label_width = legend_array[mir].box.width;

                legend_array[mir].row = row++;
                legend_array[mir].col = col;
            }

            // compute the maximum height for a square
            if (legend_array[mir].box.heigth > iMICRORNA_HEIGHT) {
                temp_max_height = legend_array[mir].box.heigth;
            } else {
                temp_max_height = iMICRORNA_HEIGHT;
            }

            if (temp_max_height > iLEGEND_MAX_HEIGHT) {
                iLEGEND_MAX_HEIGHT = temp_max_height;
            }
        }

        // get the last column width
        if (row != 0) {
            aCOLUMN_WIDTH[col] = max_label_width + iMICRORNA_WIDTH;
        }
        // draw in the legend
        for (mir in legend_array) {
            legend_array[mir].draw(iMICRORNA_LAST_POS);
        }

        var width = iMICRORNA_WIDTH + iGAP;
        for (var i in aCOLUMN_WIDTH) {
            width += aCOLUMN_WIDTH[i] + 3 * iGAP;
        }

        var height = (total_row_height + 1) * (iLEGEND_MAX_HEIGHT + iGAP);

        print_gradient(iLEFT_PADDING, iMICRORNA_LAST_POS, 5 * (iLEGEND_MAX_HEIGHT + iGAP));

        var cadre = svg.append("rect")
                       .attr("x", iLEFT_PADDING + iGRADIENT_WIDTH + iGAP)
                       .attr("y", iMICRORNA_LAST_POS)
                       .attr("width", width)
                       .attr("height", height + iGAP)
                       .style("fill", "#000")
                       .style("fill-opacity", 0)
                       .style("stroke", "#000")
                       .style("stroke-width", "1");

        cadre.node().parentNode.insertBefore(cadre.node(), cadre.node().parentNode.firstChild);

        // update legend last position
        iLEGEND_LAST_POS = iMICRORNA_LAST_POS + height;
    }
}

// ----print/gradient
var printGradient = function(x, y, hauteurG) {
    var gradient = svg.append("linearGradient").attr("id", "gradient").attr("y1", "0%").attr("y2", "100%").attr("x1", "0%").attr("x2", "0%").attr("gradientUnits", "objectBoundingBox");

    gradient.append("stop").attr("offset", "0").attr("stop-color", "red").attr("stop-opacity", "1");

    gradient.append("stop").attr("offset", "0.3").attr("stop-color", "yellow").attr("stop-opacity", "1");

    gradient.append("stop").attr("offset", "0.6").attr("stop-color", "green").attr("stop-opacity", "1");

    gradient.append("stop").attr("offset", "0.90").attr("stop-color", "blue").attr("stop-opacity", "1");

    gradient.append("stop").attr("offset", "1").attr("stop-color", "#000").attr("stop-opacity", "1");

    svg.append("rect").attr("x", x).attr("y", y).attr("width", "10").attr("height", hauteurG).attr("fill", "url(#gradient)");
}
// ---- print/drawmir
var drawMir = function(mirTab) {

    // pour savoir la position de la dernière ligne
    var ligneMax = 0;

    // pour tous les mir dans mirtab, on cacul la position en pixel, puis on regarde s'il y a chevauchement

    for (var mir in mirTab) {
        mirTab[mir]["positionRelative"] = Math.floor(padgauche + (pixelparnt * mirTab[mir]["position"]) + grosseurHorinzonMirRect / 2);

        mirTab[mir]["ligne"] = 1;

        // tant qu'il y a un chevauchement on descend d'une ligne
        while (checkChevauchement(mirTab[mir])) {
            mirTab[mir]["ligne"]++;
        }

        mirTab[mir]["rect"] = new MiRectangle(mirTab[mir]["ligne"], mirTab[mir]["positionRelative"], mirTab[mir]["color"], mirTab[mir]["quantity"], mirTab[mir]["name"], mirTab[mir]["position"], mirTab[mir]["number"], mirTab[mir]["effectiveness"]);
        mirTab[mir]["rect"].draw();
        if (mirTab[mir]["ligne"] > ligneMax)
            ligneMax = mirTab[mir]["ligne"];

        var mirnaFin = GAP + hauteurDebutMir + (grosseurVertMirRect + GAP) * ligneMax;
    }
    console.log("ligneMax : " + ligneMax);

    return mirnaFin;

};

//---------------------------------------------------------------------
var checkChevauchement = function(mir) {
    posMiAComparer = mir["positionRelative"];
    ligneMiAComparer = mir["ligne"];
    nomMiAComparer = mir["name"];

    for (var mi in info["microrna"]) {
        nomMiTest = info["microrna"][mi]["name"];
        posMiTest = info["microrna"][mi]["positionRelative"];
        ligneMiTest = info["microrna"][mi]["ligne"];

        if (!(posMiTest == posMiAComparer && nomMiAComparer == nomMiTest))// pour ne pas comparer le mir a lui-meme
        {
            if (ligneMiAComparer !== 0)// compare seulement ceux qui on deja ete placez
            {
                if (posMiTest - 1 > posMiAComparer)// limite gauche
                {
                    if (posMiTest - 1 < posMiAComparer + grosseurHorinzonMirRect)
                        if (ligneMiTest == ligneMiAComparer)
                            return true;
                } else if (posMiTest + 1 > posMiAComparer - grosseurHorinzonMirRect)
                    if (ligneMiTest == ligneMiAComparer)
                        return true;
            }
        }
    }//-------------------------------------------- fin de la loop
    return false;
};

//-- print/drawscale

// permet de dessiner l'echelle au desus du mRna

var drawscale = function() {

    svg.append("line").attr("x1", padgauche).attr("y1", hauteurtickbar).attr("x2", width + padgauche).attr("y2", hauteurtickbar).style("stroke", "#000").style("stroke-width", "2");

    tickbar();

}
var tickbar = function() {

    var distanceEntreLesTcks = divisionJusteDuMrna();

    var taille = info["gene"]["length"];
    var distancecritique = Math.floor(taille / 20);

    for (var off = 0; off <= taille - distancecritique; off += distanceEntreLesTcks) {

        var posx = Math.floor(padgauche + off * pixelparnt);

        svg.append("line").attr("x1", posx).attr("y1", hauteurtickbar - hauteurtks).attr("x2", posx).attr("y2", hauteurtickbar + hauteurtks).style("stroke", "#000").style("stroke-width", "1");

        var id = "";
        if (off >= 1000) {
            if (off % 1000 == 0) {
                id += (off / 1000) + "K";
            } else {
                id += (off / 1000).toFixed(1) + "K";
            }
        } else
            id = "" + off;

        svg.append("text").attr("x", posx).attr("y", hauteurtickbar - hauteurtks - 5).attr("fill", "#000").text(id);

    }

    // derniere ligne

    svg.append("line").attr("x1", width + padgauche).attr("y1", hauteurtickbar - hauteurtks).attr("x2", width + padgauche).attr("y2", hauteurtickbar + hauteurtks).style("stroke", "#000").style("stroke-width", "1");

    svg.append("text").attr("x", width + padgauche).attr("y", hauteurtickbar - hauteurtks - 5).attr("fill", "#000").text(info["gene"]["length"]);
};

var divisionJusteDuMrna = function() {
    var taille = info["gene"]["length"];
    var x = 16000;
    if (taille > x)
        return 4000;
    var timeout = 0;
    while (x > 50 || timeOut > 20) {
        x /= 2;

        if (taille > x)
            return Math.floor(x / 4);

        timeout++;
    }

    //minimum 5

    return 5;

};

// print/printmrna
var printNom = function() {
    svg.append("text").attr("x", padgauche).attr("y", hauteurNom).attr("opacity", 1).style("font-weight", "bold").text(info["gene"]["name"] + " : " + info["gene"]["percentile"] + "%(percentile), " + info["gene"]["quantity"] + " copies");

}
// print/printmrna/printmrna
var printMRna = function() {

    printNom();

    svg.append("rect").attr("x", padgauche).attr("y", hauteurGene).attr("width", width).attr("height", epaisseurGene).style("fill", "#000").style("stroke", "#000").style("stroke-width", "1");

    var largeurReel = info["gene"]["cds_end"] * pixelparnt - info["gene"]["cds_start"] * pixelparnt + padgauche;
    var debutCds = info["gene"]["cds_start"] * pixelparnt + padgauche;

    svg.append("rect").attr("x", debutCds).attr("y", hauteurGene).attr("width", largeurReel).attr("height", epaisseurGene).style("fill", "#898484").style("stroke", "#898484").style("stroke-width", "1");
};
//- objet
// coordonne35
var Coordonne3_5 = function(total, troisP, cinqP) {
    this.total = total;
    this.troisP = troisP / total * width;
    this.cinqP = cinqP / total * width;
    //alert("3p : "+ this.troisP+"\n5p : "+this.cinqP)

    function print() {

    }

}
//legelement
var legElement = function(mir) {

    this.name = mir.name;
    var name = this.name;
    var targ = 0;

    this.text = svg.append("text").attr("id", "text" + this.name).attr("pos", -1).attr("id", name + "text").attr("target", targ).attr("fill", "#000").attr("opacity", 1e-6).text(this.name);

    this.box = this.text.node().getBBox();

    this.c = mir.color;

    //var width = currentName.node().getComputedTextLength();

}

legElement.prototype.draw = function(mirnaFin) {

    var rect = new MiRectangle(this.ligne, 0, this.c, 0, this.name)

    //var current = svg.select("text").attr("id",this.name);

    var y = mirnaFin + this.ligne * (maxy + GAP) + GAP;
    var x = padgauche + GAP + largeurGradient;

    for (var i = 0; i < this.colonne; i++) {
        x += largeurCol[i] + 3 * GAP;
    }

    rect.x1 = x + GAP;
    rect.y1 = y;

    rect.draw();

    this.text.attr("x", x + grosseurHorinzonMirRect + 2 * GAP).attr("y", y + grosseurVertMirRect).style("opacity", 1).on("mouseover", this.over).on("mouseout", this.out).on("click", this.click);

};
//--------------------------------------------------
legElement.prototype.click = function() {

    var id = d3.event.target.id;

    var name = id.substring(0, id.length - "text".length);
    var res = clicked[name];
    if (res == undefined && colorTab.length > 0) {
        clicked[name] = colorTab.pop();

        var select = svg.selectAll("#" + name);

        select.style("stroke", clicked[name]).style("stroke-width", "2")
    } else {
        if (res == undefined && colorTab.length == 0) {
            console.log("max d'objet atteint");
        } else {
            if (res != undefined) {
                colorTab.push(res);
                clicked[name] = undefined;

                var select = svg.selectAll("#" + name);

                select.style("stroke", "#000").style("stroke-width", "0.5")
            }
        }
    }
    console.log("click");
}

legElement.prototype.over = function() {

    //var pos = this.positionR;
    /*
     miR-155 @3,457
     1,345 copies (19%)
     34 targets
     */

    var id = d3.event.target.id;

    var select = svg.selectAll("#" + id.substring(0, id.length - "text".length));

    select.style("stroke", "yellow").style("stroke-width", "2")
}

legElement.prototype.out = function() {

    div.transition().duration(500).style("opacity", 1e-6);

    var id = d3.event.target.id;

    var name = id.substring(0, id.length - "text".length);

    if (clicked[name] == undefined) {
        var select = svg.selectAll("#" + name);

        select.style("stroke", "#000").style("stroke-width", "0.5")
    } else {
        var select = svg.selectAll("#" + name);

        select.style("stroke", clicked[name]).style("stroke-width", "2")
    }
};

//mirectangle
var MiRectangle = function(ligne, positionR, c, quantite, name, pos, targ, eff) {

    this.quantite = quantite;
    this.name = name;
    this.ligne = ligne;
    this.positionR = positionR;
    this.c = c;
    this.pos = Math.round(pos);
    this.targ = targ;
    this.eff = eff;

    this.y1 = hauteurDebutMir + (grosseurVertMirRect + GAP) * (ligne - 1);
    this.x1 = positionR - grosseurHorinzonMirRect;

}

MiRectangle.prototype.draw = function() {
    var pos = this.pos;
    var name = this.name;
    var cpy = this.quantite;
    var targ = this.targ;
    var eff = this.eff;

    var e1 = svg.append("rect").attr("id", name).attr("pos", pos).attr("copies", cpy).attr("target", targ).attr("eff", eff).attr("x", this.x1).attr("y", this.y1).attr("width", grosseurHorinzonMirRect).attr("height", grosseurVertMirRect).style("fill", this.c).style("stroke", "#000").style("stroke-width", "0.5").on("mouseover", this.over).on("mouseout", this.out).on("click", this.click);

    // e1.parentNode.appendChild(el);
};

MiRectangle.prototype.click = function() {

    var name = d3.event.target.id;
    var res = clicked[name];
    if (res == undefined && colorTab.length > 0) {
        clicked[name] = colorTab.pop();
        div

        var select = svg.selectAll("#" + name);

        select.style("stroke", clicked[name]).style("stroke-width", "2")
    } else {
        if (res == undefined && colorTab.length == 0) {
            console.log("max d'objet atteint");
        } else {
            if (res != undefined) {
                colorTab.push(res);
                clicked[name] = undefined;

                var select = svg.selectAll("#" + d3.event.target.id);

                select.style("stroke", "#000").style("stroke-width", "0.5")
            }
        }
    }
    console.log("click");
}

MiRectangle.prototype.over = function() {

    //var pos = this.positionR;
    /*
    miR-155 @3,457
    1,345 copies (19%)
    34 targets
    */

    // verification de firefox
    var firefox = navigator.userAgent.indexOf('Firefox') != -1;

    div.transition().duration(500).style("opacity", 0.9);

    var ta = d3.event.target;

    var name = "";
    var copies = "";
    var pos = "";
    var target = "";
    var eff = "";

    if (!firefox) {
        name = d3.event.target.id;
        copies = d3.event.target.attributes[2].firstChild.data;
        pos = d3.event.target.attributes[1].firstChild.data;
        target = d3.event.target.attributes[3].firstChild.data;
        eff = d3.event.target.attributes[4].firstChild.data;
    } else {
        name = d3.event.target.id;
        copies = d3.event.target.attributes[2].nodeValue;
        pos = d3.event.target.attributes[1].nodeValue;
        target = d3.event.target.attributes[3].nodeValue;
        eff = d3.event.target.attributes[4].nodeValue;
    }

    var text = "";
    if (pos != 0) {
        text = name + " @ " + pos + "<br/>" + copies + " copies<br/>" + target + " target(s)<br/>effectiveness : " + eff;
    } else {
        text = d3.event.target.id;
    }

    var x = d3.event.target.x.animVal.value;
    var y = d3.event.target.y.animVal.value + 30;

    console.log("x: " + x + " y:" + y);

    div.html(text).style("left", x + "px").style("top", y + "px");
    console.log(d3.event);

    //.text(d3.event.target.id + "\n Pos : " + d3.event.target.attributes[1].firstChild.data)

    var select = svg.selectAll("#" + d3.event.target.id);

    select.style("stroke", "yellow").style("stroke-width", "2")
}

MiRectangle.prototype.out = function() {

    div.transition().duration(500).style("opacity", 1e-6);

    var name = d3.event.target.id;

    if (clicked[name] == undefined) {
        var select = svg.selectAll("#" + name);

        select.style("stroke", "#000").style("stroke-width", "0.5")
    } else {
        var select = svg.selectAll("#" + name);

        select.style("stroke", clicked[name]).style("stroke-width", "2")
    }
};

//mirna

var MiRna = function(name, position, eff, quantite) {
    this.name = name;
    this.position = position;
    this.eff = eff;
    this.quantite = quantite;
    this.c = "#000";
    this.positionRelative = 0;
    this.ligne = 0;
    this.rect = null;
}
//mrna
var MRna = function(name, coord, mirTab) {
    this.name = name;
    this.coord = coord;
    this.mirTab = mirTab;
    // alert("posi: " + this.mirTab[9].position);
    this.pixParNt = (width / coord.total).toPrecision(3);
    // alert("width = "+width+"\npxParNt : " + this.pixParNt);
}