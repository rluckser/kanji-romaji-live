/* Kuromoji Web Worker
 * Builds the kuromoji (IPADIC) tokenizer OFF the main thread so the page
 * stays responsive while the ~18 MB dictionary is downloaded, decompressed
 * and built. The main thread renders instantly with its built-in fallback
 * converter, then swaps in these contextual tokens as they arrive.
 *
 * Protocol:
 *   main -> worker : { type: 'init' }
 *   main -> worker : { type: 'tokenize', line: string }
 *   worker -> main : { type: 'ready' }
 *   worker -> main : { type: 'error', message: string }
 *   worker -> main : { type: 'tokens', line: string, tokens: Array|null }
 */
'use strict';

let tokenizer = null;
let buildStarted = false;

function buildTokenizer() {
  if (buildStarted) return;
  buildStarted = true;

  try {
    importScripts('https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js');
  } catch (e) {
    postMessage({ type: 'error', message: 'Gagal memuat kuromoji.js: ' + e });
    return;
  }

  // Watchdog: kuromoji's loader never calls back if a dictionary request
  // stalls (e.g. a failed XHR is treated as an empty download and the
  // gunzip throws silently). Report an error after 90s so the page can
  // label its fast fallback mode honestly instead of "loading" forever.
  // The build itself is NOT aborted: if it still finishes later, the
  // 'ready' message below will upgrade the page then.
  const watchdog = setTimeout(function () {
    if (!tokenizer) {
      postMessage({ type: 'error', message: 'Kamus terlalu lama dimuat (watchdog 90 detik)' });
    }
  }, 90000);

  kuromoji.builder({ dicPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/' }).build(function (err, builtTokenizer) {
    clearTimeout(watchdog);
    if (err || !builtTokenizer) {
      postMessage({ type: 'error', message: String(err || 'Tokenizer kosong') });
      return;
    }
    tokenizer = builtTokenizer;
    postMessage({ type: 'ready' });
  });
}

self.addEventListener('message', function (e) {
  const data = e.data || {};

  if (data.type === 'init') {
    buildTokenizer();
    return;
  }

  if (data.type === 'tokenize') {
    if (!tokenizer) {
      postMessage({ type: 'tokens', line: data.line, tokens: null });
      return;
    }
    try {
      const tokens = tokenizer.tokenize(data.line).map(function (t) {
        return {
          surface_form: t.surface_form,
          reading: t.reading,
          pos: t.pos,
          basic_form: t.basic_form
        };
      });
      postMessage({ type: 'tokens', line: data.line, tokens: tokens });
    } catch (err) {
      postMessage({ type: 'tokens', line: data.line, tokens: null });
    }
  }
});
