require(['config'], function () {
require(['d3', 'lodash'], function (d3, _) {

    var square = function (x) { return x * x; };
    var exclamate = function (x) { return '¡' + x + '!'; };

    d3.select('#chart')
        .selectAll('p')
        .data(_.range(10).map(square))
        .enter()
            .append('p')
            .text(exclamate);

});
});

