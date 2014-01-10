var MRna = function (name, coord, mirTab) {
    this.name = name;
    this.coord = coord;
    this.mirTab = mirTab;
    // alert("posi: " + this.mirTab[9].position);
    this.pixParNt = (width / coord.total).toPrecision(3);
    // alert("width = "+width+"\npxParNt : " + this.pixParNt);
}