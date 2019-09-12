import blobCompare from '@';
import blobs from '../fixtures';

let dataset = new Map();

dataset.set('empty', blobs.buffer(0));
dataset.set('small', blobs.buffer(Math.pow(2, 16)));
dataset.set('medium', blobs.getBuffer('mid.jpg'));
dataset.set('big', blobs.buffer(Math.pow(2, 26)));
// dataset.set('huge', blobs.buffer(10 * Math.pow(2, 26)));

for (let [name, buf] of dataset) {
  suite(`Comparator benchmark with ${name} ArrayBuffer (${buf.byteLength} bytes)`, () => {
    benchmark(`Worker`, async () => {
      const vs = buf.slice(0);

      return await blobCompare.compareBuffers(buf, vs);
    }, {maxTime: 1});

    benchmark(`Main thread`, async () => {
      const vs = buf.slice(0);

      return await blobCompare.compareBuffers(buf, vs, false);
    }, {maxTime: 1});
  }, {
    onComplete() {
      dataset.delete(name);
    }
  });
}
