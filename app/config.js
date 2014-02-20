require.config({
    paths: {
        d3: 'lib/d3/d3.v3.min',
        nv: 'lib/nvd3/nv.d3.min',
        lodash: 'lib/lodash/lodash.min',
        functional: 'lib/functional-1.0.2/functional.min',
        lambada: 'lib/lambada/lambada'
    },
    shim: {
        d3: {
            exports: 'd3'
        },
        nv: {
            exports: 'nv',
            deps: ['d3']
        },
        functional: {
            exports: 'Functional'
        }
    }
});

