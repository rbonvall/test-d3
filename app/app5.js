require(['config'], function () {
require(['d3', 'lodash', 'functional'], function (d3, _, F) {
    'use strict';

    var λ = F.lambda;
    var width = 500, height = 300;

    var svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'hsl(250, 50%, 80%)')
        ;
    d3.json('data/elim2014.json', function () {});

    function matchPoints(match) {
        var th = match.teams[0], gh = match.score[0];
        var tv = match.teams[1], gv = match.score[1];
        var pts = {};
        if      (gh > gv) { pts[th] = 3; pts[tv] = 0; }
        else if (gh < gv) { pts[th] = 0; pts[tv] = 3; }
        else              { pts[th] = 1; pts[tv] = 1; }
        return pts;
    }

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

    function objToArray(obj) {
        var array = [];
        _(obj).keys().each(function (i) {
            array[Number(i)] = obj[i];
        });
        return _.compact(array);

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

        var z = zero(pa);
        var z_expected = { CHI: 0, ESP: 0, HON: 0, SUI: 0 };
        assertEqual(z, z_expected, 'zero');

        var a = addValues({a: 15, b: 10}, {a: 50, b: 100});
        var a_expected = {a: 65, b: 110};
        assertEqual(a, a_expected, 'addValues');

    }());

    function assertEqual(a, b, msg) {
        if (_(a).isEqual(b)) {
            console.debug('✓', msg);
        } else {
            console.debug('✗', msg);
            console.debug('  Got:', a, 'Expected:', b);
        }
    }

});
});

