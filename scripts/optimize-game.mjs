// Cloudflare 专用后处理：dist/game/index.wasm -> index.wasm.gz，并给 index.html 注入解压包装
// 只动 dist/（构建产物），不碰 public/game/，所以 GitHub Pages 的构建流程完全不受影响。
// 用法：vite build && node scripts/optimize-game.mjs   （也就是 npm run build:cf）
import { readFileSync, writeFileSync, existsSync, rmSync, statSync, readdirSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const dir = 'dist/game'
const wasmPath = `${dir}/index.wasm`
const htmlPath = `${dir}/index.html`

if (!existsSync(wasmPath)) {
  console.log('[optimize-game] 没找到 dist/game/index.wasm，跳过')
  process.exit(0)
}

const raw = readFileSync(wasmPath)
const gz = gzipSync(raw, { level: 9 })
writeFileSync(`${wasmPath}.gz`, gz)
rmSync(wasmPath)
console.log(`[optimize-game] wasm ${(raw.length / 1048576).toFixed(2)} MiB -> ${(gz.length / 1048576).toFixed(2)} MiB (.gz)`)

const SNIPPET = `
\t\t<script id="__wasmGzShim">
\t\t// 把 Godot 对 index.wasm 的请求透明改成 index.wasm.gz 并流式解压
\t\t// （Cloudflare Pages 单文件上限 25 MiB，原始 wasm 有 34 MiB）
\t\t(function () {
\t\t\tvar WASM_SIZE = ${raw.length};
\t\t\tif (typeof DecompressionStream === 'undefined') {
\t\t\t\tconsole.warn('[game] 浏览器不支持 DecompressionStream，无法加载压缩版 wasm');
\t\t\t\treturn;
\t\t\t}
\t\t\tvar origFetch = window.fetch.bind(window);
\t\t\twindow.fetch = function (input, init) {
\t\t\t\tvar url = (typeof input === 'string') ? input : (input && input.url) || '';
\t\t\t\tif (!/\\.wasm(\\?.*)?$/.test(url)) return origFetch(input, init);
\t\t\t\tvar gzUrl = url.replace(/\\.wasm(\\?.*)?$/, '.wasm.gz$1');
\t\t\t\treturn origFetch(gzUrl, init).then(function (res) {
\t\t\t\t\tif (!res.ok) return origFetch(input, init);
\t\t\t\t\tvar stream = res.body.pipeThrough(new DecompressionStream('gzip'));
\t\t\t\t\treturn new Response(stream, {
\t\t\t\t\t\tstatus: 200,
\t\t\t\t\t\theaders: { 'Content-Type': 'application/wasm', 'Content-Length': String(WASM_SIZE) },
\t\t\t\t\t});
\t\t\t\t});
\t\t\t};
\t\t})();
\t\t</script>
`

let doc = readFileSync(htmlPath, 'utf8')
if (doc.includes('__wasmGzShim')) {
  console.log('[optimize-game] index.html 已注入过，跳过注入')
} else {
  const anchor = '<script src="index.js"></script>'
  if (!doc.includes(anchor)) {
    console.error('[optimize-game] 找不到 <script src="index.js"></script>，注入失败')
    process.exit(1)
  }
  doc = doc.replace(anchor, SNIPPET + '\t\t' + anchor)
  writeFileSync(htmlPath, doc)
  console.log('[optimize-game] 已给 index.html 注入解压包装（在 index.js 之前）')
}

let max = { name: '', size: 0 }
for (const f of readdirSync(dir)) {
  const s = statSync(`${dir}/${f}`).size
  if (s > max.size) max = { name: f, size: s }
}
const limit = 25 * 1048576
console.log(
  `[optimize-game] dist/game 最大文件: ${max.name} ${(max.size / 1048576).toFixed(2)} MiB` +
  `（Cloudflare 上限 25 MiB）${max.size > limit ? ' ❌ 仍然超限！' : ' ✅'}`
)
