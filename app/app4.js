require(['config'], function () {
require(['d3', 'lambada'], function (d3, λ) {
    'use strict';

    var round  = λ.sequence('*100', Math.round, '/100');
    var random = λ.sequence(Math.random, '*2.302', Math.exp, round);

    var lumScale = d3.scale.linear()
        .domain([0, 10])
        .range([100, 50]);
    var colorFunc = function (x) {
        return 'hsl(20, 50%, {}%)'.replace('{}', lumScale(x));
    };

    var m = 30, n = 10, matrix = [];
    d3.range(m).forEach(function () {
        matrix.push(d3.range(n).map(random));
    });

    var table = d3.select('#matrix')
        .append('table');

    table.selectAll('tr')
        .data(matrix)
        .enter().append('tr')

        .selectAll('td')
        .data(λ.id)
        .enter().append('td')
            .text(λ.id)
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


