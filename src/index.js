import {blobToBinaryString, blobToArrayBuffer, compareBuffers} from './lib';
import WebworkerPromise from 'webworker-promise';
import Worker from './main.worker';

/**
 * Detect if workers are enabled in current browser
 * @type {Boolean}
 */

export let workersEnabled = Boolean(window.Worker);

/**
 * Utility class to nest all methods
 */
export default class blobCompare {

  /**
   * Convert a blob to a binary string through a web worker thread
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}    blob      Blob
   * @param   {Number}  chunk     Size in bytes to slice blob
   * @return  {Promise<String>}   Raw binary data as a string
   */
  static async toBinaryStringWithWorker(blob, chunk) {
    const worker = new WebworkerPromise(new Worker());
    const response = await worker.exec('binary', {blob, chunk});

    worker.terminate();
    return response;
  }

  /**
   * Convert a blob to a binary string through main thread
   *
   * The blob can optionnaly be sliced with the chunk arguments
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  blob Blob to convert and optionnally sample
   * @param   {Number}  chunk Size in bytes to slice blob
   * @return  {Promise<String>}       Binary data as a string
   */
  static toBinaryStringWithoutWorker(blob, chunk) {
    return blobToBinaryString(blob, chunk);
  }

  /**
   * Convert a blob to a binary string
   *
   * The blob can optionnaly be sliced with the chunk arguments
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  blob Blob to convert and optionnally sample
   * @param   {Number}  chunk Size in bytes to slice blob
   * @param   {Boolean} [worker=true] Wether to use webworkers if available
   * @return  {Promise<String>}       Binary data as a string
   */
  static toBinaryString(blob, chunk, worker = true) {
    return (worker && workersEnabled) ? this.toBinaryStringWithWorker(blob, chunk) : this.toBinaryStringWithoutWorker(blob, chunk);
  }

  /**
   * Convert a blob to an ArrayBuffer through a web worker
   *
   * The blob can optionnally be sliced with the `chunk`argument
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  blob Blob
   * @param   {Number}  chunk Size in bytes to slice blob
   * @return  {Promise<ArrayBuffer>}       Binary data as a buffer
   */
  static async toArrayBufferWithWorker(blob, chunk) {
    const worker = new WebworkerPromise(new Worker());
    const response = await worker.exec('buffer', {blob, chunk});

    worker.terminate();
    return response;
  }

  /**
   * Convert a blob to an ArrayBuffer through main thread
   *
   * The blob can optionnally be sliced with the `chunk`argument
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  blob Blob
   * @param   {Number}  chunk Size in bytes to slice blob
   * @return  {Promise<ArrayBuffer>}       Binary data as a buffer
   */
  static toArrayBufferWithoutWorker(blob, chunk) {
    return blobToArrayBuffer(blob, chunk);
  }

  /**
   * Convert a blob to an ArrayBuffer
   *
   * The blob can optionnally be sliced with the `chunk`argument
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  blob Blob
   * @param   {Number}  chunk Size in bytes to slice blob
   * @param   {Boolean} [worker=true] Wether to use webworkers if available
   * @return  {Promise<ArrayBuffer>}       Binary data as a buffer
   */
  static toArrayBuffer(blob, chunk, worker = true) {
    return (worker && workersEnabled) ? this.toArrayBufferWithWorker(blob, chunk) : this.toArrayBufferWithoutWorker(blob, chunk);
  }

  /**
   * Compares two buffers byte through web worker
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {ArrayBuffer}  buf1          First buffer
   * @param   {ArrayBuffer}  buf2          Second buffer
   * @return  {Promise<Boolean>}           `true` if buffers are equal
   */
  static async compareBuffersWithWorker(buf1, buf2) {
    if (buf1 === buf2) return true;

    const worker = new WebworkerPromise(new Worker());
    const response = await worker.exec('compare', {buf1, buf2}, [buf1, buf2]);

    worker.terminate();
    return response;
  }

  /**
   * Compares two buffers byte to byte through main thread
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {ArrayBuffer}  buf1          First buffer
   * @param   {ArrayBuffer}  buf2          Second buffer
   * @return  {Boolean}           `true` if buffers are equal
   */
  static compareBuffersWithoutWorker(buf1, buf2) {
    return compareBuffers(buf1, buf2);
  }

  /**
   * Compares two buffers byte to byte
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {ArrayBuffer}  buf1          First buffer
   * @param   {ArrayBuffer}  buf2          Second buffer
   * @param   {Boolean} [worker=true]      Whether to use worker or not
   * @return  {Promise<Boolean>|Boolean}   `true` if buffers are equal
   */
  static compareBuffers(buf1, buf2, worker = true) {
    return (worker && workersEnabled) ? this.compareBuffersWithWorker(buf1, buf2) : this.compareBuffersWithoutWorker(buf1, buf2);
  }

  /**
   * Compare size of two blobs
   *
   * Obviously, two different blobs in content can have the same size and this method is only useful
   * to discriminate blobs
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  b1 First blob
   * @param   {Blob}  b2 Second Blob
   * @return  {Boolean}     `true` if sizes are equal
   */
  static sizeEqual(b1, b2) {
    return b1.size === b2.size;
  }

  /**
   * Compare type of two blobs
   *
   * Never rely solely on this method to discriminate blobs or, worse, consider them as equal
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}    b1  First blob
   * @param   {Blob}    b2  Second blob
   * @return  {Boolean}     `true` if types are equal
   */
  static typeEqual(b1, b2) {
    return b1.type === b2.type;
  }

  /**
   * Compares the magic numbers of two blobs
   *
   * This method simply compare byte to byte at the start of data where magic numbers are usually located in most cases. You can find a quite
   * exhaustive list of file signatures on [wikipedia](https://en.wikipedia.org/wiki/List_of_file_signatures)
   *
   * It does not provide any informations about file type, but you can easily use a library like [`file-type`](https://www.npmjs.com/package/file-type) to parse
   * more informations about data if needed.
   *
   * Be warned that this method can lead to false negative/positive for some file types given the currently naive algorithm.
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  b1 First blob
   * @param   {Blob}  b2 Second blob
   * @param   {Boolean} [worker=true] Wether to use webworkers if available
   * @return  {Promise<Boolean>}   `true` if magic numbers string is matching between two blogs   *
  */
  static async magicNumbersEqual(b1, b2, worker = true) {
    if (b1 === b2) return true;

    const sizes = [24, 16, 14, 12, 8, 6, 4];

    let [s1, s2] = await Promise.all([this.toBinaryString(b1, 24, worker), this.toBinaryString(b2, 24, worker)]);

    for (let size of sizes) {
      /* istanbul ignore else */
      if (s1.substring(0, size) === s2.substring(0, size)) return true;
    }

    return false;
  }

  /**
   * Compares two blobs by using binary strings
   *
   * This is not the default method to byte compare two blobs as benchmarks shows it's a little bit slower than using array buffers in most cases.
   *
   * There's still at least two cases where using binary string is much faster :
   * - Empty blobs
   * - Blobs much prone to have difference at the start of the data
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  b1   First blob
   * @param   {Blob}  b2   Second blob
   * @param   {Number}  size Size in bytes to slice blobs
   * @param   {Boolean} [worker=true] Wether to use webworkers if available
   * @return  {Promise<Boolean>}      Evaluates to `true` if blobs (or sliced blobs) are equals byte to byte
   */
  static async bytesEqualWithBinaryString(b1, b2, size, worker = true) {
    if (b1 === b2) return true;

    const [s1, s2] = await Promise.all([this.toBinaryString(b1, size, worker), this.toBinaryString(b2, size, worker)]);

    return s1 === s2;
  }

  /**
   * Compares two blobs by using arraybuffers
   *
   * This is the default comparison method
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  b1   First blob
   * @param   {Blob}  b2   Second blob
   * @param   {Number}  size Size in bytes to slice blobs
   * @param   {Boolean} [worker=true] Wether to use webworkers if available
   * @return  {Promise<Boolean>}      Evaluates to `true` if blobs (or sliced blobs) are equals byte to byte
   * @throws  Error When comparison method is not recognized
   */
  static async bytesEqualWithArrayBuffer(b1, b2, size, worker = true) {
    if (b1 === b2) return true;

    const [buf1, buf2] = await Promise.all([this.toArrayBuffer(b1, size, worker), this.toArrayBuffer(b2, size, worker)]);

    return this.compareBuffers(buf1, buf2, worker);
  }

  /**
   * Automatically compares two blobs by using the given methods
   *
   * Allowed methods are with aliases :
   * - `byte`, `bytes`, `content` : Performs a byte comparison between the two blogs. The optional `sizes` option parameter can be used to provide sizes
   * to perform comparison on sliced blobs. See {@link blobCompare.bytesEqualWithArrayBuffer} and {@link blobCompare.bytesEqualWithBinaryString} for more informations;
   * - `magic`, `headers`, `numbers`, `mime` : Compare two blobs based on magic numbers. See {@link blobCompare.magicNumbersEqual} for more informations;
   * - `size`, `sizes` : Compare two blobs based on their size in bytes. See {@link blobCompare.sizeEqual} for more informations;
   * - `type`, `types` : Compare two blobs based on their type. See {@link blobCompare.typeEqual} for more informations.
   *
   *
   * Using the `partial` option can be tricky as it's easy to have false positive.
   *
   * As default, `isEqual` performs first a check on `size` method to discrimate blobs, then `type`, then `magic` and fallback on `byte` comparison on full data.
   * This default order ensures the most optimized resource cost, though performing a complete comparison. For huge blobs, one may think about doing chunks comparison.
   *
   * Workers can be disabled through options
   *
   * @version 1.1.0
   * @since   1.0.0
   * @param   {Blob}  b1                First blob
   * @param   {Blob}  b2                Second blob
   * @param   {Object}  [options]   Configuration to use when performing comparison
   * @param   {Array}   [options.methods=['size', 'type', 'magic', 'byte']] Default methods used for comparison. Methods are applied in the same order
   * @param   {String}  [options.byte='buffer']   If set to `buffer`, byte comparison will be based on arraybuffers. Otherwise, it will use binary strings
   * @param   {Boolean} [options.partial=false]   When set to `true`, the first successful comparison method will prevent further evaluations and return true immediately
   * @param   {Array}   [options.chunks=null]      Custom sizes to use when performing a byte comparison. It really have few usage as one must ensure a regular pattern in blobs data to avoid false positive
   * @param   {Boolean} [options.worker=true]      Wether to use web workers if available
   * @return  {Promise<Boolean>}                   If `true`, blobs are equals given the used methods
   */
  static async isEqual(b1, b2, {methods = ['size', 'type', 'magic', 'byte'], byte = 'buffer', partial = false, chunks = null, worker = true} = {}) {
    let passed = null;

    for (let method of methods) {
      if (passed === false) break;
      if (partial && passed === true) break;

      switch (method) {
        case 'byte':
        case 'bytes':
        case 'content':
          chunks = chunks instanceof Array ? chunks : [b1.size];
          passed = true;

          for (let chunk of chunks) {
            let chunkPassed = false;

            chunkPassed = byte === 'buffer' ? await this.bytesEqualWithArrayBuffer(b1, b2, chunk, worker) : await this.bytesEqualWithBinaryString(b1, b2, chunk, worker);
            if (!chunkPassed) passed = false;
          }
          break;

        case 'magic':
        case 'headers':
        case 'numbers':
        case 'mime':
          passed = await this.magicNumbersEqual(b1, b2, worker);
          break;

        case 'size':
        case 'sizes':
          passed = this.sizeEqual(b1, b2);
          break;

        case 'type':
        case 'types':
          passed = this.typeEqual(b1, b2);
          break;

        default: throw new Error('Blob-compare : Unknown comparison method');
      }
    }

    return passed;
  }
}
