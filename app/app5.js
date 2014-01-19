require(['config'], function () {
require(['d3', 'lodash', 'functional'], function (d3, _, F) {
    'use strict';

    var λ = F.lambda;
    var twoDecimals = function (x) { return x.toFixed(2); };
    var width = 800, height = 400;
    var margin = 50;

    var svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'hsl(250, 50%, 80%)')
        ;
    d3.json('data/elim2014.json', function (obj) {
        var pts = objToArray(pointsByMatchday(obj.matches));
        var accPts = accumulatedPointsByMatchday(pts);
        var relPts = accPts.map(matchdayRelativePoints);
        d3.select('body')
            .selectAll('p')
            .data(relPts)
            .enter()
                .append('p')
                .text(function (m, i) {
                    m = _.mapValues(m, twoDecimals);
                    return "" + (i + 1) + ": " + JSON.stringify(m).replace(/"/g, '');
                })
            ;

        var x = d3.scale.linear()
            .domain([1, accPts.length])
            .range([margin, width - margin])
            ;
        var y = d3.scale.linear()
            .domain([0, 1])
            .range([height - margin, margin])
            ;
        var line = d3.svg.line()
            .interpolate('monotone')
            .x(function (d, i) { return x(i); })
            .y(function (d) { return y(d); })
            ;
        var colorScale = d3.scale.category10();
       _(obj.teams).keys().each(function (team, i) {
            var color = colorScale(i);
            svg.append("text")
                .datum(team)
                .attr('x', width - 1.5 * margin)
                .attr('y', y(_.last(relPts)[team]))
                .attr('text-color', color)
                .text(obj.teams[team])
                ;
            svg.append("path")
                .datum(_.pluck(relPts, team))
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", "5")
                .attr("d", line)
                ;
       });


    });

    function pointsByMatchday(matches) {
        return _(matches)
            .groupBy('matchday')
            .mapValues(function (matchday) {
                return matchday.map(matchPoints);
            })
            .mapValues(function (ptsPerMatch) {
                return _.merge.apply(null, ptsPerMatch);
            })
            .value()
            ;
    }

    function accumulatedPointsByMatchday(ptsPerMatchday) {
        var pts = [];
        var z = zero(ptsPerMatchday);
        _(ptsPerMatchday).each(function (m, i) {
            var subTotals = ptsPerMatchday.slice(0, i + 1).reduce(addValues, z);
            pts.push(subTotals);
        });
        return pts;
    }

    function matchdayRelativePoints(matchdayPoints) {
        var max = _.max(matchdayPoints);
        var min = _.min(matchdayPoints);
        return _(matchdayPoints)
            .mapValues(function (x) {
                return (x - min) / (max - min);
            }).value()
            ;
    }

    function zero(ptsPerMatchday) {
        return _(ptsPerMatchday)
            .map(_.keys)
            .flatten()
            .unique()
            .zipObject()
            .mapValues(λ('0'))
            .value()
            ;
    }

    function addValues(a, b) {
        return _.merge(_.clone(a), b, λ('+'));
    }

    function objToArray(obj) {
        var array = [];
        _(obj).keys().each(function (i) {
            array[Number(i)] = obj[i];
        });
        return _.compact(array);
    }

    function matchPoints(match) {
        var th = match.teams[0], gh = match.score[0];
        var tv = match.teams[1], gv = match.score[1];
        var pts = {};
        if      (gh > gv) { pts[th] = 3; pts[tv] = 0; }
        else if (gh < gv) { pts[th] = 0; pts[tv] = 3; }
        else              { pts[th] = 1; pts[tv] = 1; }
        return pts;
    }

    (function test() {
        var obj = {
            teams: { CHI: 'Chile', ESP: 'España', HON: 'Honduras', SUI: 'Suiza' },
            matches: [
                {"matchday": 1, "teams": ["CHI", "HON"], "score": [1, 0]},
                {"matchday": 1, "teams": ["ESP", "SUI"], "score": [0, 1]},
                {"matchday": 2, "teams": ["SUI", "CHI"], "score": [0, 1]},
                {"matchday": 2, "teams": ["HON", "ESP"], "score": [1, 3]},
                {"matchday": 3, "teams": ["CHI", "ESP"], "score": [1, 2]},
                {"matchday": 3, "teams": ["SUI", "HON"], "score": [0, 0]}
            ]
        };

        var po = pointsByMatchday(obj.matches);
        var po_expected = {
            1: { CHI: 3, ESP: 0, HON: 0, SUI: 3 },
            2: { CHI: 3, ESP: 3, HON: 0, SUI: 0 },
            3: { CHI: 0, ESP: 3, HON: 1, SUI: 1 }
        };
        assertEqual(po, po_expected, 'pointsByMatchday');

        var pa = objToArray(po);
        var pa_expected = [
            { CHI: 3, ESP: 0, HON: 0, SUI: 3 },
            { CHI: 3, ESP: 3, HON: 0, SUI: 0 },
            { CHI: 0, ESP: 3, HON: 1, SUI: 1 }
        ];
        assertEqual(pa, pa_expected, 'objToArray');

        var pt = accumulatedPointsByMatchday(pa);
        var pt_expected = [
            { CHI: 3, ESP: 0, HON: 0, SUI: 3 },
            { CHI: 6, ESP: 3, HON: 0, SUI: 3 },
            { CHI: 6, ESP: 6, HON: 1, SUI: 4 }
        ];
        assertEqual(pt, pt_expected, 'accumulatedPointsByMatchday');

        var rp = matchdayRelativePoints(_.last(pt));
        var rp_expected = { CHI: 1, ESP: 1, HON: 0, SUI: 3/5 };
        assertEqual(rp, rp_expected, 'matchdayRelativePoints');

        var z = zero(pa);
        var z_expected = { CHI: 0, ESP: 0, HON: 0, SUI: 0 };
        assertEqual(z, z_expected, 'zero');

        var a = addValues({a: 15, b: 10}, {a: 50, b: 100});
        var a_expected = {a: 65, b: 110};
        assertEqual(a, a_expected, 'addValues');

        assertEqual(matchPoints({ teams: ['A', 'B'], score: [0, 0]}), {A: 1, B: 1}, 'matchPoints₁');
        assertEqual(matchPoints({ teams: ['A', 'B'], score: [1, 0]}), {A: 3, B: 0}, 'matchPoints₂');
        assertEqual(matchPoints({ teams: ['A', 'B'], score: [1, 3]}), {A: 0, B: 3}, 'matchPoints₃');
        assertEqual(matchPoints({ teams: ['A', 'B'], score: [2, 2]}), {A: 1, B: 1}, 'matchPoints₄');

    }());

    function assertEqual(a, b, msg) {
        /* global console */
        if (_(a).isEqual(b)) {
            console.debug('✓', msg);
        } else {
            console.debug('✗', msg);
            console.debug('  Got:', a, 'Expected:', b);
        }
    }

});
});


