require(['config'], function () {
require(['d3', 'lodash', 'functional'], function (d3, _, F) {
    'use strict';

    var λ = F.lambda;
    var round  = F.sequence(λ('*100'), Math.round, λ('/100'));
    var random = F.sequence(Math.random, λ('*2.302'), Math.exp, round);

    var lumScale = d3.scale.linear()
        .domain([0, 10])
        .range([100, 50]);
    var colorFunc = function (x) {
        return 'hsl(20, 50%, {}%)'.replace('{}', lumScale(x));
    };

    var m = 30, n = 10, matrix = [];
    _.range(m).forEach(function (i) {
        matrix.push(_.range(n).map(random));
    });

    var table = d3.select('#matrix')
        .append('table');

    table.selectAll('tr')
        .data(matrix)
        .enter().append('tr')

        .selectAll('td')
        .data(F.id)
        .enter().append('td')
            .text(F.id)
            .style('background-color', colorFunc)
            .on('mouseover', function () {
                var me = d3.select(this);
                var currentColor = d3.hsl(me.style('background-color'));
                me.style('background-color', currentColor.darker());
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .delay(2000)
                    .duration(500)
                    .style('background-color', colorFunc);
            })
        ;

});
});


