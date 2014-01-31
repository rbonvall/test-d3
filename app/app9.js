require(['config'], function () {
require(['d3', 'functional'], function (d3, F) {
    'use strict';

    var λ = F.lambda;

    var width = 500, height = 150;
    var barPadding = 1;

    var generate = F.sequence(Math.random, λ('*25'), Math.floor);
    var dataset = d3.range(30).map(generate);
    var n = dataset.length;

    var xScale = d3.scale.ordinal()
        .domain(d3.range(n))
        .rangeRoundBands([0, width], 0.05)
    ;
    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([0, height])
    ;

    var blueish = function (b) {
        return 'rgb(0, 0, B)'.replace('B', b);
    };

    var svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
    ;
    svg.selectAll('rect')
        .data(dataset)
        .enter()
            .append('rect')
            .attr('x',      F.flip(xScale))
            .attr('y',      function (d) { return height - yScale(d); })
            .attr('width',  xScale.rangeBand())
            .attr('height', yScale)
            .attr('fill',   F.sequence(λ('*10'), blueish))
    ;
    svg.selectAll('text')
        .data(dataset)
        .enter()
            .append('text')
            .classed('barLabel', true)
            .text(F.id)
            .attr('x', function (d, i) {
                return xScale(i) + xScale.rangeBand() / 2;
            })
            .attr('y', function (d) { return height - yScale(d) + 14; })
    ;







});
});


