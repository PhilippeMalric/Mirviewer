var MiRectangle = function (ligne, positionR, c,quantite,name,pos,targ,eff) {

	this.quantite = quantite;
    this.name = name;
    this.ligne = ligne;
    this.positionR = positionR;
    this.c = c;
	this.pos =  Math.round(pos);
	this.targ = targ;
	this.eff = eff;
	
    this.y1 = hauteurDebutMir + (grosseurVertMirRect + GAP) * (ligne - 1);
    this.x1 = positionR - grosseurHorinzonMirRect  ;

	
  
}

MiRectangle.prototype.draw = function() {
	var pos = this.pos;
	var name = this.name;
	var cpy = this.quantite;
	var targ = this.targ;
	var eff = this.eff;
	
       var e1 = svg.append("rect")
			.attr("id",name)
			.attr("pos",pos)
			.attr("copies",cpy)
			.attr("target",targ)
			.attr("eff",eff)
            .attr("x", this.x1)
            .attr("y", this.y1)
            .attr("width", grosseurHorinzonMirRect)
            .attr("height", grosseurVertMirRect)
            .style("fill", this.c)
            .style("stroke", "#000")
            .style("stroke-width", "0.5")
			.on("mouseover", this.over)
			.on("mouseout", this.out)
			.on("click", this.click);
			
      // e1.parentNode.appendChild(el);
    };
	
MiRectangle.prototype.click = function() {

var name = d3.event.target.id;
var res = clicked[name];
if (res == undefined && colorTab.length > 0)
{
clicked[name] = colorTab.pop();

div

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
	
	var select = svg.selectAll("#"+d3.event.target.id);
		  
		  select.style("stroke", "#000")
		  .style("stroke-width", "0.5")
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

  div.transition()
      .duration(500)
      .style("opacity", 0.9);
  
  var ta = d3.event.target;
  
  var name = "";
  var copies = "";
  var pos = "";
  var target = "";
  var eff = "";
  
  
  if(!firefox)
  {
    name = d3.event.target.id;
	copies = d3.event.target.attributes[2].firstChild.data;
	pos = d3.event.target.attributes[1].firstChild.data;
	target = d3.event.target.attributes[3].firstChild.data;
	eff = d3.event.target.attributes[4].firstChild.data;
  }
  else
  {
	name = d3.event.target.id;
	copies = d3.event.target.attributes[2].nodeValue;
	pos = d3.event.target.attributes[1].nodeValue;
	target = d3.event.target.attributes[3].nodeValue;
	eff = d3.event.target.attributes[4].nodeValue;
  }
  
  var text = "";
  if( pos != 0)
  {
  text = name+" @ "+pos+"<br/>"+copies+" copies<br/>"+ target +" target(s)<br/>effectiveness : "+eff;
  }
  else
  {
  text = d3.event.target.id;
  }
  
  var x = d3.event.target.x.animVal.value;
  var y = d3.event.target.y.animVal.value+30;
  
  console.log("x: "+x+" y:"+y);
  
  div
      .html(text)
      .style("left", x + "px")
      .style("top", y + "px");
	  console.log(d3.event);
	  
	  //.text(d3.event.target.id + "\n Pos : " + d3.event.target.attributes[1].firstChild.data)
	  
	  var select = svg.selectAll("#"+d3.event.target.id);
	  
	  select.style("stroke", "yellow")
	  .style("stroke-width", "2")
}
	
MiRectangle.prototype.out = function() {

	div.transition()
      .duration(500)
      .style("opacity", 1e-6);
	  
	  var name = d3.event.target.id;
	  
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