require(['config'], function () {
require(['d3', 'lambada'], function (d3, λ) {
    'use strict';

    var width = 500, height = 300, padding = 40;

    var dataScale = d3.scale.linear()
        .domain([0, 1])
        .range([20, 40]);
    var generate = λ.sequence(Math.random, dataScale, Math.floor);
    var dataLength = 10;
    var dataset = [
        d3.range(dataLength).map(generate),
        d3.range(dataLength).map(generate).map(λ('+25')),
        d3.range(dataLength).map(generate).map(λ('+50')),
    ];

    // Coordinate scaling functions
    var x = d3.scale.linear()
        .domain([0, dataLength])
        .range([padding, width - padding]);
    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height - padding, padding]);

    var svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height);

    // Define axes
    var xAxis = d3.svg.axis().scale(x).ticks(dataLength);
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
        .x(λ.flip(x))
        .y(y);

    // Draw lines
    svg.selectAll('path.dataLine')
        .data(dataset)
        .enter()
            .append('path')
            .classed('dataLine', true)
            .attr('d', line)
            .attr('stroke', d3.scale.category20());

    // Put labels
    svg.selectAll('g.dataLabels')
        .data(dataset)
        .enter()
            .append('g')
            .classed('dataLabels', true)

        .selectAll('text.dataLabel')
        .data(λ.id)
        .enter()
            .append('text')
            .classed('dataLabel', true)
            .text(Math.floor)
            .attr('x', λ.flip(x))
            .attr('y', λ.sequence('+5', y));

    // Show raw data on the document
    d3.select('#data')
        .html(JSON.stringify(dataset)
                .replace(/,/g, ',\n')
                .replace(/\],/g, '],<br>'));

});
});


