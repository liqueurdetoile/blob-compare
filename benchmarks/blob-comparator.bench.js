import blobCompare from '@';
import avatarData1 from 'arraybuffer-loader!../tests/data/avatar.jpg';
import avatarData2 from 'arraybuffer-loader!../tests/data/avatar2.jpg';
import pngData1 from 'arraybuffer-loader!../tests/data/png1.png';
import pngData2 from 'arraybuffer-loader!../tests/data/png2.png';
import bmpData1 from 'arraybuffer-loader!../tests/data/bmp1.bmp';
import bmpData2 from 'arraybuffer-loader!../tests/data/bmp2.bmp';

const blobs = new Map([
  ['empty', new Blob()],
  ['smallA', new Blob(['a'], {type: 'text/plain'})],
  ['smallB', new Blob(['b'], {type: 'text/plain'})],
  ['midA', new Blob(['a'.repeat(1024)], {type: 'text/plain'})],
  ['midB', new Blob(['b'.repeat(1024)], {type: 'text/plain'})],
  ['midAB', new Blob(['a'.repeat(512) + 'b'.repeat(512)], {type: 'text/plain'})],
  ['jpg1', new Blob([new Uint8Array(avatarData1)], {type: 'image/jpeg'})],
  ['jpg2', new Blob([new Uint8Array(avatarData2)], {type: 'image/jpeg'})],
  ['png1', new Blob([new Uint8Array(pngData1)], {type: 'image/png'})],
  ['png2', new Blob([new Uint8Array(pngData2)], {type: 'image/png'})],
  ['bmp1', new Blob([new Uint8Array(bmpData1)], {type: 'image/bmp'})],
  ['bmp2', new Blob([new Uint8Array(bmpData2)], {type: 'image/bmp'})],
]);

const benches = [
  ['empty', 'empty'],
  ['empty', 'smallA'],
  ['smallA', 'smallA'],
  ['smallA', 'smallB'],
  ['midA', 'midAB'],
  ['jpg1', 'jpg1'],
  ['jpg1', 'jpg2'],
  ['png1', 'png1'],
  ['png1', 'png2'],
  ['bmp1', 'bmp1'],
  ['bmp1', 'bmp2'],
  ['jpg1', 'png1']
]

for (let bench of benches) {
  const [b1, b2] = bench;

  suite(`Byte comparator with ${b1} vs ${b2}`, () => {
    benchmark(`Binary string`, async () => {
      return await blobCompare.bytesEqualWithBinaryString(blobs.get(b1), blobs.get(b2));
    });

    benchmark(`ArrayBuffer`, async () => {
      return await blobCompare.bytesEqualWithArrayBuffer(blobs.get(b1), blobs.get(b2));
    });
  });
}
