import {blobToBinaryString, blobToArrayBuffer, compareBuffers} from './lib';
import registerWebworker from 'webworker-promise/lib/register';

registerWebworker()
  .operation('binary', async ({blob, chunk}) => {
    return await blobToBinaryString(blob, chunk);
  })
  .operation('buffer', async ({blob, chunk}) => {
    return await blobToArrayBuffer(blob, chunk);
  })
  .operation('compare', ({buf1, buf2}) => {
    return compareBuffers(buf1, buf2);
  });
