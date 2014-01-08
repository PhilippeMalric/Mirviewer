removeHsa();

var colorTab =  Array( "#4DAF4A", "#984EA3", "#FF7F00", "#A65628", "#F781BF", "#999999");

var finLegende = 0;

// tableau des elements clickez
var clicked = {};



var largeurCol = new Array();
var svg = d3.select("body").append("div").attr("class","outer").append("class","inner").append("svg");
svg.attr("width", window.innerWidth).attr("height",window.innerHeight);
var pixelparnt = width/info["gene"]["length"];
//assignRandomEff(info["microrna"]);
assignColor(info["microrna"]);
//checkposition(info["microrna"]);

printMRna();
var mirnaFin = drawMir(info["microrna"]);
drawscale();

//maxy contient la hauteur maximal d'une case de la legende
var maxy;

drawlegend(mirnaFin);

svg.append("line")
          .attr("x1", padgauche)
          .attr("y1", finLegende)
          .attr("x2", width + padgauche)
          .attr("y2", finLegende);
