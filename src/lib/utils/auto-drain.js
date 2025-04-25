/* eslint-disable no-empty,no-unused-vars */

let _events;
let _EventEmitter;

if(typeof require !== 'undefined') {
  try { _events = require('events'); _EventEmitter = _events.EventEmitter; } catch(e) {}
}

// const {EventEmitter} = require('events');

// =============================================================================
// AutoDrain - kind of /dev/null
class AutoDrain extends _EventEmitter {
  write(chunk) {
    this.emit('data', chunk);
  }

  end() {
    this.emit('end');
  }
}

module.exports = AutoDrain;
