require(['config'], function () {
require(['d3'], function (d3) {
    'use strict';

    function addGetterSetter(object, config, property) {
        var getterSetter = function (value) {
            if (!arguments.length) {
                return config[property];
            }
            config[property] = value;
            return object;
        }
        object[property] = getterSetter;
    }

    function simpleChart() {
        var config = {
            width: 100,
            height: 80,
            padding: 5,

            xValue: function (d, i) { return i; },
            yValue: function (d, i) { return d; },
            domain: [0, 1]
        };

        function my(selection) {
            selection.each(function (data) {

            });
        };

        d3.keys(config).forEach(function (prop) {
            addGetterSetter(my, config, prop);
        });

        return my;
    }

    var c = simpleChart()
        .width(50)
        .height(100);

    d3.select('#chart')
        .data([80, 100, 30, 70, 25])
        .call(c);

});
});


