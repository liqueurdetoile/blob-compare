/* istanbul ignore next */
export default {
  create(pattern) {
    const content = [];

    for (let [char, count] of pattern) {
      content.push(char.repeat(count));
    }

    return new Blob(content, {type: 'text/plain'});
  },

  buffer(size) {
    return new ArrayBuffer(size);
  },

  get(filename) {
    if (filename === 'empty') return new Blob();

    const buf = require(`./${filename}`);
    const ext = filename.slice(-3);
    let type;

    switch (ext) {
      case 'png' :
        type = 'image/png';
        break;
      case 'bmp' :
        type = 'image/bmp';
        break;
      case 'jpg' :
        type = 'image/jpeg';
        break;
      case 'txt' :
        type = 'text/plain';
        break;
    }

    return new Blob([new Uint8Array(buf)], {type});
  },

  getBuffer(filename) {
    if (filename === 'empty') return new ArrayBuffer();

    return require(`./${filename}`);
  },

  empty() {
    return new Blob();
  }
}
