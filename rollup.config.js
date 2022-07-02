import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import sourcemaps from 'rollup-plugin-sourcemaps';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const CJS = 'CJS';
const ES = 'ES';
const UMD = 'UMD';

const input = './compiled/index.js';

const getGlobals = (bundleType) => {
    const baseGlobals = {
        'react-dom': 'ReactDOM',
        react: 'React',
    };

    if (bundleType === UMD) return baseGlobals;
    return {};
};

const getExternal = (bundleType) => {
    const peerDependencies = Object.keys(pkg.peerDependencies);
    const dependencies = Object.keys(pkg.dependencies);

    // Hat-tip: https://github.com/rollup/rollup-plugin-babel/issues/148#issuecomment-399696316.
    const makeExternalPredicate = (externals) => {
        if (externals.length === 0) {
            return () => false;
        }
        const pattern = new RegExp(`^(${externals.join('|')})($|/)`);
        return (id) => pattern.test(id);
    };

    if ([CJS, ES].includes(bundleType)) return makeExternalPredicate([...peerDependencies, ...dependencies]);
    return makeExternalPredicate(peerDependencies);
};

const isProduction = (bundleType) => bundleType === CJS || bundleType === UMD;

const getBabelConfig = (bundleType) => {
    const options = {
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [['@babel/env', { loose: true, modules: false }], '@babel/react'],
        plugins: ['@babel/transform-runtime'],
        runtimeHelpers: true,
    };

    if (bundleType === ES) {
        return {
            ...options,
            plugins: [...options.plugins],
        };
    }

    return {
        ...options,
        plugins: [...options.plugins],
    };
};

const getPlugins = (bundleType) => [
    peerDepsExternal(),
    nodeResolve({ browser: true }),
    commonjs({
        include: 'node_modules/**',
        namedExports: {
            'node_modules/react-is/index.js': ['typeOf', 'isElement', 'isValidElementType', 'ForwardRef'],
        },
    }),
    babel(getBabelConfig(bundleType)),
    replace({
        'process.env.NODE_ENV': JSON.stringify(isProduction(bundleType) ? 'production' : 'development'),
    }),
    sourcemaps(),
    sizeSnapshot(),
    isProduction(bundleType) &&
        terser({
            output: { comments: false },
            compress: {
                keep_infinity: true,
                pure_getters: true,
            },
            warnings: true,
            ecma: 5,
            toplevel: false,
        }),
];

const getCjsConfig = () => ({
    input,
    external: getExternal(CJS),
    output: {
        exports: 'named',
        file: `dist/react-local-toast.cjs.production.js`,
        format: 'cjs',
        sourcemap: true,
    },
    plugins: getPlugins(CJS),
});

const getEsConfig = () => ({
    input,
    external: getExternal(ES),
    output: {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
    },
    plugins: getPlugins(ES),
});

const getUmdConfig = () => ({
    input,
    external: getExternal(UMD),
    output: {
        file: `dist/react-local-toast.umd.production.js`,
        format: 'umd',
        globals: getGlobals(UMD),
        name: 'ReactLocalToast',
        sourcemap: true,
    },
    plugins: getPlugins(UMD),
});

export default [getCjsConfig(), getEsConfig(), getUmdConfig()];
