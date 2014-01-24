require(['config'], function () {
require(['d3', 'simple'], function (d3, simpleChart) {
    'use strict';

    var c = simpleChart()
        .width(50)
        .height(100);

    // d3.select('#chartA')
    //     .data([80, 100, 30, 70, 25])
    //     .call(c);

    d3.select('#chartB')
        .data([500, 200, 300, 150, 200])
        .call(c);

    d3.select('#chartC')
        .data([[70, 70, 70, 90, 30], [30, 40, 40, 60, 70]])
        .call(c);

});
});


