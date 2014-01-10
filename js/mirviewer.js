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

    var microrna_last_pos = draw_microrna(info["microrna"]);
    draw_scale();

    draw_legend(microrna_last_pos);

    SVG.append("line")
       .attr("x1", iLEFT_PADDING)
       .attr("y1", iLEGEND_LAST_POS)
       .attr("x2", iWIDTH + iLEFT_PADDING)
       .attr("y2", iLEGEND_LAST_POS);
});

function assign_color(mir_array, effKey) {
    // Generate a gradient range
    var color = d3.scale.linear().domain([0.1, 1]).range(["blue", "red"]);

    // Associate a color to each microrna according to the gradient
    for (var mir in mir_array) {
        if (mir_array[mir][effKey] < 0.1) {
            mir_array[mir].color = "#000";
        } else {
            mir_array[mir].color = color(mir_array[mir][effKey]);
        }
    }

}

function draw_legend(microrna_last_pos){
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
        iLEGEND_LAST_POS = microrna_last_pos;
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
            legend_array[mir].draw(microrna_last_pos);
        }

        var width = iMICRORNA_WIDTH + iGAP;
        for (var i in aCOLUMN_WIDTH) {
            width += aCOLUMN_WIDTH[i] + 3 * iGAP;
        }

        var height = (total_row_height + 1) * (iLEGEND_MAX_HEIGHT + iGAP);

        print_gradient(iLEFT_PADDING, microrna_last_pos, 5 * (iLEGEND_MAX_HEIGHT + iGAP));

        var cadre = svg.append("rect")
                       .attr("x", iLEFT_PADDING + iGRADIENT_WIDTH + iGAP)
                       .attr("y", microrna_last_pos)
                       .attr("width", width)
                       .attr("height", height + iGAP)
                       .style("fill", "#000")
                       .style("fill-opacity", 0)
                       .style("stroke", "#000")
                       .style("stroke-width", "1");

        cadre.node().parentNode.insertBefore(cadre.node(), cadre.node().parentNode.firstChild);

        // update legend last position
        iLEGEND_LAST_POS = microrna_last_pos + height;
    }
}

function print_gradient(x, y, gradient_height) {
    var gradient = SVG.append("linearGradient")
                      .attr("id", "gradient")
                      .attr("y1", "0%")
                      .attr("y2", "100%")
                      .attr("x1", "0%")
                      .attr("x2", "0%")
                      .attr("gradientUnits", "objectBoundingBox");

    gradient.append("stop")
            .attr("offset", "0")
            .attr("stop-color", "red")
            .attr("stop-opacity", "1");

    gradient.append("stop")
            .attr("offset", "0.3")
            .attr("stop-color", "yellow")
            .attr("stop-opacity", "1");

    gradient.append("stop")
            .attr("offset", "0.6")
            .attr("stop-color", "green")
            .attr("stop-opacity", "1");

    gradient.append("stop")
            .attr("offset", "0.90")
            .attr("stop-color", "blue")
            .attr("stop-opacity", "1");

    gradient.append("stop")
            .attr("offset", "1")
            .attr("stop-color", "#000")
            .attr("stop-opacity", "1");

    SVG.append("rect")
       .attr("x", x)
       .attr("y", y)
       .attr("width", "10")
       .attr("height", gradient_height)
       .attr("fill", "url(#gradient)");
}

function draw_mir(microrna_array) {
    // find out the position of the last row of microrna
    var max_row = 0;

    // compute the position
    for (var mir in microrna_array) {
        microrna_array[mir]["positionRelative"] = Math.floor(iLEFT_PADDING + (iNT_WIDTH * microrna_array[mir]["position"]) + iMICRORNA_WIDTH / 2);

        microrna_array[mir]["row"] = 1;

        // tant qu'il y a un chevauchement on descend d'une ligne
        while (is_overlapping(microrna_array[mir])) {
            microrna_array[mir]["row"]++;
        }

        microrna_array[mir]["rect"] = new MiRectangle(microrna_array[mir]["row"],
                                                      microrna_array[mir]["relative_position"],
                                                      microrna_array[mir]["color"],
                                                      microrna_array[mir]["quantity"],
                                                      microrna_array[mir]["name"],
                                                      microrna_array[mir]["position"],
                                                      microrna_array[mir]["number"],
                                                      microrna_array[mir]["effectiveness"]);
        microrna_array[mir]["rectangle"].draw();
        if (microrna_array[mir]["row"] > max_row)
            max_row = microrna_array[mir]["row"];

        var microrna_last_pos = iGAP + iINITIAL_MICRORNA_Y + (iMICRORNA_HEIGHT + iGAP) * max_row;
    }

    return microrna_last_pos;
}

function is_overlapping(microrna) {
    position = microrna["relative_position"];
    row = microrna["row"];
    name = microrna["name"];

    var verdict = false;
    for (var mir in mDATA["microrna"]) {
        curr_name = mDATA["microrna"][mir]["name"];
        curr_position = mDATA["microrna"][mir]["relative_position"];
        curr_row = mDATA["microrna"][mir]["row"];

        if ((curr_position != position || name != curr_name) &&
            row !== 0 &&
            ((curr_position - 1 > position && curr_position - 1 < position + iMICRORNA_WIDTH && curr_row == row) ||
            (curr_position + 1 > position - iMICRORNA_WIDTH && curr_row == row))){
                verdict = true;
                break;
            }

        // if (!(curr_position == position && name == curr_name)) // do not compare with itself
        // {
            // if (row !== 0)// compare seulement ceux qui on deja ete placez
            // {
                // if (curr_position - 1 > position)// limite gauche
                // {
                    // if (curr_position - 1 < position + iMICRORNA_WIDTH)
                        // if (curr_row == row)
                            // return true;
                // } else if (curr_position + 1 > position - iMICRORNA_WIDTH)
                    // if (curr_row == row)
                        // return true;
            // }
        // }
    }
    return verdict;
};

function draw_scale() {
    SVG.append("line")
       .attr("x1", iLEFT_PADDING)
       .attr("y1", iSCALE_Y)
       .attr("x2", iWIDTH + iLEFT_PADDING)
       .attr("y2", iSCALE_Y)
       .style("stroke", "#000")
       .style("stroke-width", "2");

    draw_ticks();
}

function draw_ticks() {
    var spacing = get_gene_spacing();

    var size = mDATA["gene"]["length"];
    var critical_spacing = Math.floor(size / 20);

    for (var off = 0; off <= size - critical_spacing; off += spacing) {
        var x = Math.floor(iLEFT_PADDING + off * iNT_WIDTH);

        SVG.append("line")
           .attr("x1", x)
           .attr("y1", iSCALE_Y - iSCALE_HEIGHT)
           .attr("x2", x)
           .attr("y2", iSCALE_Y + iSCALE_HEIGHT)
           .style("stroke", "#000")
           .style("stroke-width", "1");

        var id = "";
        if (off >= 1000) {
            if (off % 1000 == 0) {
                id += (off / 1000) + "K";
            } else {
                id += (off / 1000).toFixed(1) + "K";
            }
        } else
            id = "" + off;

        SVG.append("text")
           .attr("x", x)
           .attr("y", iSCALE_Y - iSCALE_HEIGHT - 5)
           .attr("fill", "#000")
           .text(id);

    }

    SVG.append("line")
       .attr("x1", width + iLEFT_PADDING)
       .attr("y1", iSCALE_Y - iSCALE_HEIGHT)
       .attr("x2", width + iLEFT_PADDING)
       .attr("y2", iSCALE_Y + iSCALE_HEIGHT)
       .style("stroke", "#000")
       .style("stroke-width", "1");

    SVG.append("text")
       .attr("x", width + iLEFT_PADDING)
       .attr("y", iSCALE_Y - iSCALE_HEIGHT - 5)
       .attr("fill", "#000")
       .text(mDATA["gene"]["length"]);
};

function get_gene_spacing(){
    var size = mDATA["gene"]["length"];
    var x = 16000;

    while(size <= x && x > 20){
        x /= 2;
    }
    
    return Math.floor(x/4);
}

function draw_gene() {
    SVG.append("text")
       .attr("x", iLEFT_PADDING)
       .attr("y", iNAME_Y)
       .attr("opacity", 1)
       .style("font-weight", "bold")
       .text(info["gene"]["name"] + " : " + mDATA["gene"]["percentile"] + "%(percentile), " + mDATA["gene"]["quantity"] + " copies");

    SVG.append("rect")
       .attr("x", iLEFT_PADDING)
       .attr("y", iGENE_Y)
       .attr("width", iWIDTH)
       .attr("height", iGENE_HEIGHT)
       .style("fill", "#000")
       .style("stroke", "#000")
       .style("stroke-width", "1");

    var real_width = mDATA["gene"]["cds_end"] * iNT_WIDTH - mDATA["gene"]["cds_start"] * iNT_WIDTH + iLEFT_PADDING;
    var cds_start = mDATA["gene"]["cds_start"] * iNT_WIDTH + iLEFT_PADDING;

    SVG.append("rect")
       .attr("x", cds_start)
       .attr("y", iGENE_Y)
       .attr("width", real_width)
       .attr("height", iGENE_HEIGHT)
       .style("fill", "#898484")
       .style("stroke", "#898484")
       .style("stroke-width", "1");
}

var LegendElement = function(mir) {
    this.name = mir.name;
    var targ = 0;

    this.text = SVG.append("text")
                   .attr("id", "text" + this.name)
                   .attr("pos", -1)
                   .attr("id", this.name + "text")
                   .attr("target", targ)
                   .attr("fill", "#000")
                   .attr("opacity", 1e-6)
                   .text(this.name);

    this.box = this.text.node().getBBox();

    this.c = mir.color;
};

legElement.prototype.draw = function(mirnaFin) {
    var rect = new MiRectangle(this.ligne, 0, this.c, 0, this.name);

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