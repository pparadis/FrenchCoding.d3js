//propriétés visuelles du graphique
var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 60
};

var width = 600 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

//la portée de l'axe des X
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//la portée de l'axe des X
var y = d3.scale.linear()
    .range([height, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("$"));

//création de l'élément SVG du document
var svg = d3
    .select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function (error, data) {
    //calcul du domaine de l'axe X
    x.domain(data.map(function (d) {
        return d.letter;
    }));

    //calcul du domaine de l'axe Y
    y.domain([0, d3.max(data, function (d) {
        return d.cout;
    })]);

    //mise en place des barres pour chacune des lettres
    var bar = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bob");

    bar.append("rect")
        .attr("class", "bar")
        .attr("fill", function (d) {
            return d.couleur;
        })
        //positonnement sur l'axe des X de la barre
        .attr("x", function (d) {
            return x(d.letter) - 50;
        })
        //positonnement sur l'axe des Y de la barre
        .attr("y", function (d) {
            return y(d.cout);
        })
        //largeur de la barre
        .attr("width", x.rangeBand() + 10)
        //hauteur de la barre
        .attr("height", function (d) {
            return height - y(d.cout);
        });
        
    bar.append("text")
        .attr("class", "bar-color")
        .attr("x", function (d) { return x(d.letter) - 17 })
        .attr("y", function (d) {
            return y(d.cout) - 10;
        })
        .attr("dy", ".35em")
        .attr("fill", "black")
        .text(function (d) { return d.cout; });

    //positionnement de l'axe des X
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(-50," + height + ")")
        .call(xAxis);

    //positionnement de l'axe des Y
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

        //Ajout du petit texte "fréquence"
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Coûts");
});