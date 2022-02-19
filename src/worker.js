import { blobToBinaryString, blobToArrayBuffer, compareBuffers } from './lib';
import registerWebworker from 'webworker-promise/lib/register';

registerWebworker()
  .operation('binary', ({ blob, chunk }) => {
    return blobToBinaryString(blob, chunk);
  })
  .operation('buffer', ({ blob, chunk }) => {
    return blobToArrayBuffer(blob, chunk);
  })
  .operation('compare', ({ buf1, buf2 }) => {
    return compareBuffers(buf1, buf2);
  });