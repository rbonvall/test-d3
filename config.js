require.config({
    paths: {
        d3: 'lib/d3/d3.v3.min',
        lodash: 'lib/lodash/lodash.min',
        functional: 'lib/functional-1.0.2/functional.min'
    },
    shim: {
        d3: {
            exports: 'd3'
        },
        functional: {
            exports: 'Functional'
        }
    }
});

