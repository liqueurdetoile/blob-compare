import blobCompare from '@';
import blobs from '../fixtures';

let dataset = new Map();

dataset.set('empty', blobs.empty());
dataset.set('small', blobs.create([['a', Math.pow(2, 16)]]));
dataset.set('medium', blobs.get('mid.jpg'));

for (let [name, blob] of dataset) {
  suite(`Converters benchmark with ${name} blob (${blob.size} bytes)`, () => {
    benchmark(`Binary String (worker)`, async () => {
      return await blobCompare.toBinaryString(blob);
    }, {maxTime: 1});

    benchmark(`ArrayBuffer (worker)`, async () => {
      return await blobCompare.toArrayBuffer(blob);
    }, {maxTime: 1});

    benchmark(`Binary String (main)`, async () => {
      return await blobCompare.toBinaryString(blob, false, false);
    }, {maxTime: 1});

    benchmark(`ArrayBuffer (main)`, async () => {
      return await blobCompare.toArrayBuffer(blob, false, false);
    }, {maxTime: 1});
  }, {
    onComplete() {
      dataset.delete(name);
    }
  });
}
