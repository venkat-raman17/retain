// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite on web ships a wa-sqlite WebAssembly binary that its worker
// imports directly (`import wasmModule from './wa-sqlite/wa-sqlite.wasm'`).
// Metro doesn't treat `.wasm` as a resolvable asset by default, so register it.
config.resolver.assetExts.push('wasm');

// wa-sqlite's persistent VFS uses OPFS sync access handles, which require a
// cross-origin-isolated context (SharedArrayBuffer). Send COEP/COOP on the dev
// server so web SQLite works locally. NOTE: these headers only apply to the
// Metro dev server — a static web export must set them at the hosting layer.
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};

module.exports = config;
