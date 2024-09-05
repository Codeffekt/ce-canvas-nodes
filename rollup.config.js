import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/ce-canvas-nodes.esm.js',
            format: 'esm',
        },
        {
            file: 'dist/ce-canvas-nodes.umd.js',
            format: 'umd',
            name: 'ce-canvas-nodes'            
        },
        {
            file: 'dist/ce-canvas-nodes.cjs',
            format: 'cjs',
            name: 'ce-canvas-nodes'            
        }
    ],
    plugins: [
        typescript({ tsconfig: './tsconfig.json'}),
        nodeResolve({
            browser: true
        }),        
    ]
}