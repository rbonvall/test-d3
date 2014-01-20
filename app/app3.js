// §7. Scales.
require(['config'], function () {
require(['d3', 'functional'], function (d3, F) {
    'use strict';

    var λ = F.lambda;
    var dataset = [
        [  5, 20],
        [480, 90],
        [250, 50],
        [100, 33],
        [330, 95],
        [410, 12],
        [475, 44],
        [ 25, 67],
        [ 85, 21],
        [220, 88]
    ];
    var width = 500;
    var height = 300;
    var padding = 30;

    var first = F.pluck(0);
    var second = F.pluck(1);

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, first)])
        .range ([padding, width - padding])
        //.range ([0, width])
        ;
    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, second)])
        .range ([height - padding, padding])
        //.range ([height, 0])
        ;

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
        .attr('cx', F.compose(xScale, first))
        .attr('cy', F.compose(yScale, second))
        .attr('r', 10)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        ;

    var labels = svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        ;

    labels
        .text(λ('d.join(", ")'))
        .attr('x', F.compose(xScale, first))
        .attr('y', F.compose(yScale, second))
        ;

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5)
        ;
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .call(xAxis)
        ;

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(10)
        ;
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis)
        ;

});
});


