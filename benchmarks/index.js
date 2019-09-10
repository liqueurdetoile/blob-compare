const benchmarks = require.context('./', true, /\.bench\.js$/);

benchmarks.keys().forEach(benchmarks);
