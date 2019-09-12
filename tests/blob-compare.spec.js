import blobCompare from '@';
import blobs from '../fixtures';

describe('Blob-compare', function() {
  /**
   * @test {blobCompare.sizeEqual}
  */
  describe('sizeEqual', function() {
    it('should return true if size are equal', function() {
      blobCompare.sizeEqual(blobs.get('bmp1.bmp'), blobs.get('bmp2.bmp')).should.be.true;
    })

    it('should return false if size are not equal', function() {
      blobCompare.sizeEqual(blobs.get('png1.png'), blobs.get('png2.png')).should.be.false;
    })
  });

  /**
   * @test {blobCompare.typeEqual}
   */
  describe('typeEqual', function() {
    it('should return true if type are equal', function() {
      blobCompare.typeEqual(blobs.get('bmp1.bmp', 'image/bmp'), blobs.get('bmp2.bmp', 'image/bmp')).should.be.true;
    })

    it('should return false if type are not equal', function() {
      blobCompare.typeEqual(blobs.get('png1.png', 'image/png'), blobs.get('bmp2.bmp', 'image/png')).should.be.false;
    })
  });

  /**
   * @test {blobCompare.magicNumbersEqual}
  */
  describe('magicNumbersEqual', function() {
    it('should return true if blobs are the same', async function() {
      let b = blobs.get('jpeg1.jpg');
      let cmp = await blobCompare.magicNumbersEqual(b, b);

      cmp.should.be.true;
    })

    it('should return true if magic numbers are equal (worker)', async function() {
      let cmp = await blobCompare.magicNumbersEqual(blobs.get('png1.png'), blobs.get('png2.png'))

      cmp.should.be.true;
    })

    it('should return true if magic numbers are equal (main thread)', async function() {
      let cmp = await blobCompare.magicNumbersEqual(blobs.get('png1.png'), blobs.get('png2.png'), false)

      cmp.should.be.true;
    })

    it('should return false if magic numbers are not equal', async function() {
      let cmp = await blobCompare.magicNumbersEqual(blobs.get('jpeg1.jpg'), blobs.get('png2.png'))

      cmp.should.be.false;
    })
  });

  /**
   * @test {blobCompare.toBinaryString}
   * @test {blobCompare.toArrayBuffer}
  */
  describe('toBinaryString && toArrayBuffer', function() {
    it('should return a binary string (worker)', async function() {
      let b = blobs.get('jpeg1.jpg');
      let s = await blobCompare.toBinaryString(b);

      expect(typeof s).to.equal('string');
    })

    it('should return a binary string (main thread)', async function() {
      let b = blobs.get('jpeg1.jpg');
      let s = await blobCompare.toBinaryString(b, false, false);

      expect(typeof s).to.equal('string');
    })

    it('should return an arrayBuffer (worker)', async function() {
      let b = blobs.get('jpeg1.jpg');
      let s = await blobCompare.toArrayBuffer(b);

      s.should.be.instanceof(ArrayBuffer);
    })

    it('should return an arrayBuffer (main thread)', async function() {
      let b = blobs.get('jpeg1.jpg');
      let s = await blobCompare.toArrayBuffer(b, false, false);

      s.should.be.instanceof(ArrayBuffer);
    })
  });

  /**
   * @test {blobCompare.compareBuffers}
  */
  describe('compareBuffers', function() {
    it('should return true if buffers are the same (worker)', async function() {
      const b = new ArrayBuffer(8);
      const res = await blobCompare.compareBuffers(b, b)

      res.should.be.true;
    })

    it('should return true if buffers are the same (main thread)', async function() {
      const b = new ArrayBuffer(8);
      const res = await blobCompare.compareBuffers(b, b, false)

      res.should.be.true;
    })

    it('should return false if buffers are not the same length', async function() {
      const b1 = new ArrayBuffer(8);
      const b2 = new ArrayBuffer(10);

      blobCompare.compareBuffers(b1, b2, false).should.be.false;
    })
  });

  /**
   * @test {blobCompare.bytesEqualWithBinaryString}
  */
  describe('bytesEqualWithBinaryString', function() {
    it('should return true if blobs are the same', async function() {
      let b = blobs.get('jpeg1.jpg');
      let cmp = await blobCompare.bytesEqualWithBinaryString(b, b);

      cmp.should.be.true;
    })

    it('should return true if bytes are equal (worker)', async function() {
      let cmp = await blobCompare.bytesEqualWithBinaryString(blobs.get('jpeg1.jpg'), blobs.get('jpeg1.jpg'));

      cmp.should.be.true;
    })

    it('should return true if bytes are equal (main thread)', async function() {
      let cmp = await blobCompare.bytesEqualWithBinaryString(blobs.get('jpeg1.jpg'), blobs.get('jpeg1.jpg'), false, false);

      cmp.should.be.true;
    })

    it('should return false if bytes are not equal', async function() {
      let cmp = await blobCompare.bytesEqualWithBinaryString(blobs.get('jpeg1.jpg'), blobs.get('jpeg2.jpg'));

      cmp.should.be.false;
    })
  });

  /**
   * @test {blobCompare.bytesEqualWithArrayBuffer}
  */
  describe('bytesEqualWithArrayBuffer', function() {
    it('should return true if blobs are the same', async function() {
      let b = blobs.get('jpeg1.jpg');
      let cmp = await blobCompare.bytesEqualWithArrayBuffer(b, b);

      cmp.should.be.true;
    })

    it('should return true if bytes are equal (worker)', async function() {
      let cmp = await blobCompare.bytesEqualWithArrayBuffer(blobs.get('jpeg1.jpg'), blobs.get('jpeg1.jpg'));

      cmp.should.be.true;
    })

    it('should return true if bytes are equal (main thread)', async function() {
      let cmp = await blobCompare.bytesEqualWithArrayBuffer(blobs.get('jpeg1.jpg'), blobs.get('jpeg1.jpg'), false, false);

      cmp.should.be.true;
    })

    it('should return false if bytes are not equal', async function() {
      let cmp = await blobCompare.bytesEqualWithArrayBuffer(blobs.get('jpeg1.jpg'), blobs.get('jpeg2.jpg'));

      cmp.should.be.false;
    })
  });

  /**
   * @test {blobCompare.isEqual}
  */
  describe('isEqual', function() {
    // build a blobs to run test automatically, [b1, b2, expected, size]
    const suite = [
      ['empty', 'empty', true],
      ['jpeg1.jpg', 'jpeg1.jpg', true],
      ['jpeg1.jpg', 'jpeg2.jpg', false],
      ['jpeg1.jpg', 'jpeg2.jpg', true, {methods: ['types']}], // Types are the same
      ['jpeg1.jpg', 'jpeg2.jpg', true, {partial: true}], // Types are the same so partial succeeds
      ['png1.png', 'png1.png', true],
      ['png1.png', 'png2.png', false],
      ['png1.png', 'png2.png', true, {methods: ['magic']}], // Magic numbers are the same
      ['png1.png', 'png2.png', true, {methods: ['magic', 'size'], partial: true}], // Magic numbers are the same
      ['bmp1.bmp', 'bmp1.bmp', true],
      ['bmp1.bmp', 'bmp2.bmp', false],
      ['bmp1.bmp', 'bmp2.bmp', true, {chunks : [512]}], // Sample size is too small to see difference between the two files
      ['bmp1.bmp', 'bmp2.bmp', false, {chunks : [512, 2048]}], // Second sample size is enough to see difference between the two files
      ['bmp1.bmp', 'bmp2.bmp', false, {methods: ['bytes']}], // Force using only blob size
      ['bmp1.bmp', 'bmp2.bmp', false, {methods: ['bytes'], byte: 'string'}], // Force using only blob size with binary string
      ['bmp1.bmp', 'bmp2.bmp', false, {methods: ['bytes'], worker: false}], // Force using only blob size with buffer in main thread
      ['bmp1.bmp', 'bmp2.bmp', true, {methods: ['size']}], // Sizes are the same though files are different
      ['jpeg1.jpg', 'png1.png', false],
    ]

    for (let t of suite) {
      const [n1, n2, expected, options] = t;

      it(`should return ${expected} with ${n1} vs ${n2} and ${options ? JSON.stringify(options) : 'default options'}`, async function() {
          const res = await blobCompare.isEqual(blobs.get(n1), blobs.get(n2), options);

          expect(res).to.equal(expected);
      })
    }

    it('should throw if one method is not recognized', async function() {
      try {
        await blobCompare.isEqual(blobs.get('jpeg1.jpg'), blobs.get('jpeg2.jpg'), {methods: ['silly']});
        expect.fail();
      } catch (err) {
        err.message.should.equal('Unknown comparison method');
      }
    })
  });
});
