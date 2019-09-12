/**
 * Convert a blob to a binary string
 *
 * The blob can optionnaly be sliced with the slice arguments
 *
 * @version 1.0.0
 * @since   1.0.0
 * @param   {Blob}  blob Blob to convert and optionnally sample
 * @param   {Number}  chunk Size in bytes to slice blob
 * @return  {Promise<String>}       Binary data as a string
 */
export function blobToBinaryString(blob, chunk) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const s = chunk ? Math.min(chunk, blob.size) : blob.size;
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
 * @param   {Number}  chunk Size in bytes to slice blob
 * @return  {Promise<ArrayBuffer>}       Binary data as a buffer
 */
export function blobToArrayBuffer(blob, chunk) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const s = chunk ? Math.min(chunk, blob.size) : blob.size;
    const b = blob.slice(0, s);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(b);
  });
}

/**
 * Compares two buffers byte to byte
 *
 * @version 1.0.0
 * @since   1.0.0
 * @param   {ArrayBuffer}  buf1          First buffer
 * @param   {ArrayBuffer}  buf2          Second buffer
 * @return  {Boolean}           `true` if buffers are equal
 */
export function compareBuffers(buf1, buf2) {
  if (buf1 === buf2) return true;
  if (buf1.byteLength !== buf2.byteLength) return false;

  const d1 = new DataView(buf1), d2 = new DataView(buf2);

  var i = buf1.byteLength;
  while (i--) {
    /* istanbul ignore else */
    if (d1.getUint8(i) !== d2.getUint8(i)) return false;
  }

  return true;
}
