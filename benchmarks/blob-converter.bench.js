import blobCompare from '@';

suite('Blob converter on 2^8 bytes', () => {
  benchmark('Binary String', async () => {
    return await blobCompare.toBinaryString(this.blob);
  });

  benchmark('Array buffer', async () => {
    return await blobCompare.toArrayBuffer(this.blob);
  });
}, {
  onStart() {
    this.blob = new Blob(['a'.repeat(Math.pow(2, 8))]);
  },
  onComplete() {
    this.blob = null;
  }
});

suite('Blob converter on 2^26 bytes', () => {
  benchmark('Binary String', async () => {
    return await blobCompare.toBinaryString(this.blob);
  });

  benchmark('Array buffer', async () => {
    return await blobCompare.toArrayBuffer(this.blob);
  });
}, {
  onStart() {
    this.blob = new Blob(['a'.repeat(Math.pow(2, 26))]);
  },
  onComplete() {
    this.blob = null;
  }
});

suite('Blob converter on 2^52 bytes', () => {
  benchmark('Binary String', async () => {
    return await blobCompare.toBinaryString(this.blob);
  });

  benchmark('Array buffer', async () => {
    return await blobCompare.toArrayBuffer(this.blob);
  });
}, {
  onStart() {
    this.blob = new Blob(['a'.repeat(Math.pow(2, 26)), 'a'.repeat(Math.pow(2, 26))]);
  },
  onComplete() {
    this.blob = null;
  }
});
