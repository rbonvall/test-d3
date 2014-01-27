require(['config'], function () {
require(['d3', 'simple'], function (d3, simpleChart) {
    'use strict';

    var c = simpleChart()
        .width(500)
        .height(200)
        .padding(40);

    d3.select('#chartA')
        .datum([80, 100, 30, 70, 25])
        .call(c);

    d3.select('#chartB')
        .datum([
            [500, 200, 300, 150, 200],
            [400, 150, 200, 100, 300]
        ])
        .call(c);

    d3.select('#chartC')
        .datum([
            [70, 65, 70, 70, 90, 30],
            [30, 40, 40, 60, 70],
            [20, 50, 100]
        ])
        .call(c);

});
});


