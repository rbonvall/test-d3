define(['d3', 'lodash', 'functional'], function (d3, _, F) {
    'use strict';

    var λ = F.lambda;

    function addGetterSetter(object, config, property) {
        object[property] = function (value) {
            if (!arguments.length) {
                return config[property];
            }
            config[property] = value;
            return object;
        }
    }

    function simpleChart() {
        var conf = {
            width: 100,
            height: 80,
            padding: 5,
            stroke: d3.scale.category20()
        };

        function createChart(data) {
            console.log('XXX', JSON.stringify({data: data}));
            if (!_.isArray(data[0])) {
                data = [data];
                console.log('XXX', JSON.stringify({converted: data}));
            }

            var flattened = _.flatten(data);
            var min = Math.min.apply(null, flattened);
            var max = Math.max.apply(null, flattened);
            var nrPlots = data.length;
            var n = Math.max.apply(null, _.pluck(data, 'length'));

            var x = d3.scale.linear()
                .domain([0, n - 1])
                .range([conf.padding, conf.width - conf.padding]);
            var y = d3.scale.linear()
                .domain([min, max])
                .range([conf.height - conf.padding, conf.padding]);

            var line = d3.svg.line()
                .x(F.flip(x))
                .y(y);

            var svg = d3.select(this)
                .append('svg')
                .attr('width', conf.width)
                .attr('height', conf.height);

            // Draw lines
            svg.selectAll('path.dataLine')
                .data(data)
                .enter()
                    .append('path')
                    .classed('dataLine', true)
                    .attr('d', line)
                    .attr('stroke', conf.stroke);

            // Put labels
            svg.selectAll('g.dataLabels')
                .data(data)
                .enter()
                    .append('g')
                    .classed('dataLine', true)

                .selectAll('text.dataLabel')
                .data(F.id)
                .enter()
                    .append('text')
                    .classed('dataLabel', true)
                    .text(Math.floor)
                    .attr('x', F.flip(x))
                    .attr('y', F.sequence(λ('+5'), y));

        }


        function my(selection) {
            selection.each(createChart);
        }

        d3.keys(conf).forEach(function (prop) {
            addGetterSetter(my, conf, prop);
        });

        return my;
    }

    return simpleChart;

});



