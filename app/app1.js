require(['config'], function () {
require(['d3'], function (d3) {
    'use strict';

    var square = function (x) { return x * x; };
    var exclamate = function (x) { return '¡' + x + '!'; };
    var redish = function (x) { return 'hsl(0, x%, 35%'.replace('x', x); };


    d3.select('#chart')
        .selectAll('p')
        .data(d3.range(1, 10).map(square))
        .enter()
            .append('p')
            .text(exclamate)
            .style('width', function (x) { return 30 + 5 * x + 'px'; } )
            .style('color', redish)
        ;
});
});

