/* eslint-disable no-empty,no-unused-vars */

let _events;
let _JSZip;
let _process;

if(typeof require !== 'undefined') {
  try { _events = require('events'); } catch(e) {}
  try { _JSZip = require('jszip'); } catch(e) {}
  try { _process = process; } catch(e) {
    _process = {
      browser: true,
    };
  }
}

// const events = require('events');
// const JSZip = require('jszip');

const StreamBuf = require('./stream-buf');
const {stringToBuffer} = require('./browser-buffer-encode');
const {Buffer} = require("buffer");

// =============================================================================
// The ZipWriter class
// Packs streamed data into an output zip stream
class ZipWriter extends _events.EventEmitter {
  constructor(options) {
    super();

    /**
     * support
     * -------
     * array
     * arraybuffer
     * base64
     * blob
     * nodebuffer
     * nodestream
     * string
     * uint8array
     */
    let type = 'string';

    if (_JSZip.support.nodebuffer) {
      type = 'nodebuffer';
    } else if (_JSZip.support.uint8array) {
      type = 'uint8array';
    }

    this.options = Object.assign(
      {
        type,
        compression: 'DEFLATE',
      },
      options
    );

    // https://stuk.github.io/jszip/documentation/examples.html
    this.zip = new _JSZip();

    this.stream = new StreamBuf();
  }

  append(data, options) {
    if (options.hasOwnProperty('base64') && options.base64) {
      this.zip.file(options.name, data, {base64: true});
    } else {
      // https://www.npmjs.com/package/process
      if (_process.browser && typeof data === 'string') {
        // use TextEncoder in browser
        data = stringToBuffer(data);
      } else if (data instanceof Uint8Array) {
        data = Buffer.from(data);
      }

      this.zip.file(options.name, data);
    }
  }

  async finalize() {
    const content = await this.zip.generateAsync(this.options);
    this.stream.end(content);
    this.emit('finish');
  }

  // ==========================================================================
  // Stream.Readable interface
  read(size) {
    return this.stream.read(size);
  }

  setEncoding(encoding) {
    return this.stream.setEncoding(encoding);
  }

  pause() {
    return this.stream.pause();
  }

  resume() {
    return this.stream.resume();
  }

  isPaused() {
    return this.stream.isPaused();
  }

  pipe(destination, options) {
    return this.stream.pipe(destination, options);
  }

  unpipe(destination) {
    return this.stream.unpipe(destination);
  }

  unshift(chunk) {
    return this.stream.unshift(chunk);
  }

  wrap(stream) {
    return this.stream.wrap(stream);
  }
}

// =============================================================================

module.exports = {
  ZipWriter,
};
