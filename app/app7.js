require(['config'], function () {
require(['d3', 'functional'], function (d3, F) {
    'use strict';

    var λ = F.lambda;

    var width = 500, height = 300, padding = 40;

    var dataScale = d3.scale.linear()
        .domain([0, 1])
        .range([20, 40]);
    var generate = F.sequence(Math.random, dataScale, Math.floor);
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
        .attr('class', 'axis')
        .attr('transform', 'translate(0, Y)'.replace('Y', height - padding))
        .call(xAxis);
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(X, 0)'.replace('X', padding))
        .call(yAxis);

    // Define line function
    var line = d3.svg.line()
        .x(F.flip(x))
        .y(y);

    // Draw lines
    svg.selectAll('path.dataLine')
        .data(dataset)
        .enter()
            .append('path')
            .attr('class', 'dataLine')
            .attr('d', line)
            .attr('stroke', d3.scale.category20());

    // Put labels
    svg.selectAll('g.dataLabels')
        .data(dataset)
        .enter()
            .append('g')
            .attr('class', 'dataLabels')

        .selectAll('text.dataLabel')
        .data(F.id)
        .enter()
            .append('text')
            .attr('class', 'dataLabel')
            .text(Math.floor)
            .attr('x', F.flip(x))
            .attr('y', F.sequence(λ('+5'), y));

    // Show raw data on the document
    d3.select('#data')
        .html(JSON.stringify(dataset)
                .replace(/,/g, ',\n')
                .replace(/\],/g, '],<br>'));

});
});


