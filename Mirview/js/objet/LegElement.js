var legElement = function(mir)
{
	
	this.name  = mir.name;
	var name = this.name;
	var targ = 0;
	
	
	
	this.text =  svg.append("text")
	.attr("id","text"+this.name)
	.attr("pos",-1)
	.attr("id",name+"text")
	.attr("target",targ)
    .attr("fill", "#000")
    .attr("opacity",1e-6)
    .text(this.name);
    
    this.box = this.text.node()
    			.getBBox();
	
	this.c = mir.color;
	
	//var width = currentName.node().getComputedTextLength();
	
}

legElement.prototype.draw = function(mirnaFin) {
	
	var rect = new MiRectangle(this.ligne, 0, this.c, 0, this.name) 
	
	//var current = svg.select("text").attr("id",this.name);
	
	var y = mirnaFin + this.ligne  * (maxy + GAP)+GAP;
	var x = padgauche + GAP+largeurGradient ;
	
	for(var i = 0 ; i<this.colonne ;i++)
		{
		 x += largeurCol[i] + 3*GAP; 
		}
	
	rect.x1 = x + GAP;
	rect.y1 = y;
	
	rect.draw();
	
	
	this.text
	.attr("x",x+grosseurHorinzonMirRect + 2 * GAP)
	.attr("y",y + grosseurVertMirRect)
	.style("opacity",1)
	.on("mouseover", this.over)
	.on("mouseout", this.out)
	.on("click", this.click);
	
};
//--------------------------------------------------
legElement.prototype.click = function() {

var id = d3.event.target.id;

var name = id.substring(0,id.length-"text".length);
var res = clicked[name];
if (res == undefined && colorTab.length > 0)
{
clicked[name] = colorTab.pop();


var select = svg.selectAll("#"+name);
	  
	  select.style("stroke", clicked[name] )
	  .style("stroke-width", "2")
}
else
{
if(res == undefined && colorTab.length == 0)
{
console.log("max d'objet atteint");
}
else{
	if(res != undefined)
	{
	colorTab.push(res);
	clicked[name] = undefined;
	
	var select = svg.selectAll("#"+name);
		  
		  select.style("stroke", "#000")
		  .style("stroke-width", "0.5")
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
	  
	  var select = svg.selectAll("#"+id.substring(0,id.length-"text".length));
	  
	  select.style("stroke", "yellow")
	  .style("stroke-width", "2")
}
	
legElement.prototype.out = function() {

	div.transition()
      .duration(500)
      .style("opacity", 1e-6);
	  
	  var id = d3.event.target.id;
	  
	  var name = id.substring(0,id.length-"text".length);
	  
	  if (clicked[name] == undefined)
	{
	  var select = svg.selectAll("#"+name);
	  
	  select.style("stroke", "#000")
	  .style("stroke-width", "0.5")
	}  
	else
	{
	var select = svg.selectAll("#"+name);
	  
	  select.style("stroke", clicked[name] )
	  .style("stroke-width", "2")
	}
};


