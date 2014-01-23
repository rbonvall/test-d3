require(['config'], function () {
require(['d3', 'functional'], function (d3, F) {
    'use strict';

    var λ = F.lambda;

    var width = 500, height = 300, padding = 40;

    var dataScale = d3.scale.linear()
        .domain([0, 1])
        .range([40, 75]);
    var generate = F.sequence(Math.random, dataScale, Math.floor);
    var dataset = d3.range(10).map(generate);

    // Coordinate scaling functions
    var x = d3.scale.linear()
        .domain([0, dataset.length])
        .range([padding, width - padding]);
    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height - padding, padding]);

    var svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height);

    // Define axes
    var xAxis = d3.svg.axis().scale(x).ticks(dataset.length);
    var yAxis = d3.svg.axis().scale(y).ticks(5).orient('left');

    // Draw axes
    svg.append('g')
        .classed('axis', true)
        .attr('transform', 'translate(0, Y)'.replace('Y', height - padding))
        .call(xAxis);
    svg.append('g')
        .classed('axis', true)
        .attr('transform', 'translate(X, 0)'.replace('X', padding))
        .call(yAxis);

    // Define line function
    var line = d3.svg.line()
        .x(F.flip(x))
        .y(y);

    // Draw line
    svg.append('path')
        .classed('dataLine', true)
        .attr('d', line(dataset));

    // Put labels
    svg.selectAll('text.dataLabel')
        .data(dataset)
        .enter()
            .append('text')
            .classed('dataLabel', true)
            .text(Math.floor)
            .attr('x', F.flip(x))
            .attr('y', F.sequence(λ('+5'), y));


    // Show raw data on the document
    d3.select('#data')
        .text(JSON.stringify(dataset).replace(/,/g, ',\n'));

});
});


