function log() {
  var message = Array.prototype.slice.call(arguments, 0);
  console.log.apply(console, ['[tower+]'].concat(message));
}

module.exports = log;