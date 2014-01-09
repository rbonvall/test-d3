require.config({
    paths: {
        d3: 'lib/d3/d3.v3.min',
        lodash: 'lib/lodash/lodash.min'
    },
    shim: {
        d3: {
            exports: 'd3'
        }
    }
});

