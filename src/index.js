export class blobCompare {
  /**
   * Convert a blob to a binary string
   *
   * The blob can optionnaly be sliced with the size arguments
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  blob Blob to convert and optionnally sample
   * @param   {Number}  size Size in bytes to slice blob
   * @return  {Promise<String>}       Binary data as a string
   */
  static toBinaryString(blob, size) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const s = size ? Math.min(size, blob.size) : blob.size;
      const b = blob.slice(0, s);

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsBinaryString(b);
    });
  }

  /**
   * Convert a blob to an ArrayBuffer
   *
   * The blob can optionnally be sliced with the `size`argument
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  blob Blob
   * @param   {Number}  size Size in bytes to slice blob
   * @return  {Promise<ArrayBuffer>}       Binary data as a buffer
   */
  static toArrayBuffer(blob, size) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const s = size ? Math.min(size, blob.size) : blob.size;
      const b = blob.slice(0, s);

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(b);
    });
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
   * @param   {Blob}  b1 First blob
   * @param   {Blob}  b2 Second blob
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
   * @return  {Promise<Boolean>}    `true` if magic numbers string is matching between two blogs
   */
  static async magicNumbersEqual(b1, b2) {
    const sizes = [24, 16, 14, 12, 8, 6, 4];

    let [s1, s2] = await Promise.all([this.toBinaryString(b1, 24), this.toBinaryString(b2, 24)]);

    for(let size of sizes) {
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
   * @return  {Promise<Boolean>}      Evaluates to `true` if blobs (or sliced blobs) are equals byte to byte
   */
  static async bytesEqualWithBinaryString(b1, b2, size) {
    const [s1, s2] = await Promise.all([this.toBinaryString(b1, size), this.toBinaryString(b2, size)]);

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
   * @return  {Promise<Boolean>}      Evaluates to `true` if blobs (or sliced blobs) are equals byte to byte
   */
  static async bytesEqualWithArrayBuffer(b1, b2, size) {
    const [buf1, buf2] = await Promise.all([this.toArrayBuffer(b1, size), this.toArrayBuffer(b2, size)]);
    const d1 = new DataView(buf1), d2 = new DataView(buf2);

    var i = buf1.byteLength;
    while (i--) {
      if (d1.getUint8(i) !== d2.getUint8(i)) {
        return false;
      }
    }

    return true;
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
   * As default, `isEqual` performs first a check on `size` method to discrimate blobs, then `type` and fallback on `byte` comparison on full data.
   *
   * @version 1.0.0
   * @since   1.0.0
   * @param   {Blob}  b1                First blob
   * @param   {Blob}  b2                Second blob
   * @param   {Object}  [options]   Configuration to use when performing comparison
   * @param   {Array}   [options.methods=['size', 'type', 'byte']] Default methods used for comparison. Methods will be applied in the same order
   * @param   {String}  [options.byte='buffer']   If set to `buffer`, byte comparison will be based on arraybuffers. Otherwise, it will use binary strings
   * @param   {Boolean} [options.partial=false]   When set to `true`, the first successful comparison method will prevent further evaluations and return true immediately
   * @param   {Array}   [options.sizes=null]      Custom sizes to use when performing a byte comparison. It really have few usage as one must ensure a regular pattern in blobs data to avoid false positive
   * @return  {Promise<Boolean>}                   If `true`, blobs are equals given the used methods
   */
  static async isEqual(b1, b2, {methods = ['size', 'type', 'byte'], byte = 'buffer', partial = false, sizes = null} = {}) {
    const passed = new Set();

    for(let method of methods) {
      let cmp;

      switch(method) {
        case 'byte':
        case 'bytes':
        case 'content':
          sizes = sizes instanceof Array ? sizes : [b1.size];
          for(let size of sizes) {
            cmp = byte === 'buffer' ? await this.bytesEqualWithArrayBuffer(b1, b2, size) : await this.bytesEqualWithBinaryString(b1, b2, size);
            if(cmp === partial) return cmp;
            passed.add(cmp);
          }
          break;

        case 'magic':
        case 'headers':
        case 'numbers':
        case 'mime':
          cmp = await this.magicNumbersEqual(b1, b2);
          if(cmp === partial) return cmp;
          passed.add(cmp);
          break;

        case 'size':
        case 'sizes':
          cmp = this.sizeEqual(b1, b2);
          if(cmp === partial) return cmp;
          passed.add(cmp);
          break;

        case 'type':
        case 'types':
          cmp = this.typeEqual(b1, b2);
          if(cmp === partial) return cmp;
          passed.add(cmp);
          break;

        default: throw new Error('Unknown comparison method');
      }
    }

    return !passed.has(false);
  }
}

export default blobCompare;
