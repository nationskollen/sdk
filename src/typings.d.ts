// Ensure that the peer dependency can be found.
// If we remove this, the library will not be able to compile
// since it can not find the module.
//
// https://github.com/ezolenko/rollup-plugin-typescript2/issues/198
declare module 'swr'
declare module 'react-async-hook'
