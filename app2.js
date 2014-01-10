require(['config'], function () {
require(['d3', 'lodash', 'functional'], function (d3, _, F) {
    'use strict';

    var λ = F.lambda;
    var dataset = _.range(1, 10).map(Math.random).map(λ('x * 50'));
    var width = 500;
    var height = 100;

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        ;

    var circles = svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        ;

    circles
        .attr('cx', λ('x, i -> 50 * i + 50'))
        .attr('cy', height / 2)
        .attr('r', 50)
        .transition()
            .delay(500)
            .duration(500)
            .attr('r', F.id)
        ;

    var labels = svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        ;

    labels
        .text(Math.floor)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('x', λ('x, i -> 50 * i + 50'))
        .attr('y', height / 2)
        ;

});
});


