import blobCompare from '@';
import avatarData1 from 'arraybuffer-loader!./data/avatar.jpg';
import avatarData2 from 'arraybuffer-loader!./data/avatar2.jpg';
import pngData1 from 'arraybuffer-loader!./data/png1.png';
import pngData2 from 'arraybuffer-loader!./data/png2.png';
import bmpData1 from 'arraybuffer-loader!./data/bmp1.bmp';
import bmpData2 from 'arraybuffer-loader!./data/bmp2.bmp';

describe('Blob-compare', function() {
  let dataset = new Map([
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

  /** @test {blobCompare.sizeEqual} */
  describe('sizeEqual', function() {
    it('should return true if size are equal', function() {
      blobCompare.sizeEqual(dataset.get('bmp1'), dataset.get('bmp2')).should.be.true;
    })

    it('should return false if size are not equal', function() {
      blobCompare.sizeEqual(dataset.get('png1'), dataset.get('bmp2')).should.be.false;
    })
  });

  /** @test {blobCompare.typeEqual} */
  describe('typeEqual', function() {
    it('should return true if type are equal', function() {
      blobCompare.typeEqual(dataset.get('bmp1'), dataset.get('bmp2')).should.be.true;
    })

    it('should return false if type are not equal', function() {
      blobCompare.typeEqual(dataset.get('png1'), dataset.get('bmp2')).should.be.false;
    })
  });

  /** @test {blobCompare.magicNumbersEqual} */
  describe('magicNumbersEqual', function() {
    it('should return true if magic numbers are equal', async function() {
      let cmp = await blobCompare.magicNumbersEqual(dataset.get('png1'), dataset.get('png2'))

      cmp.should.be.true;
    })

    it('should return false if magic numbers are equal', async function() {
      let cmp = await blobCompare.magicNumbersEqual(dataset.get('jpg1'), dataset.get('png2'))

      cmp.should.be.false;
    })
  });

  /** @test {blobCompare.bytesEqualWithArrayBuffer} */
  describe('bytesEqualWithArrayBuffer', function() {
    it('should return true if bytes are equal', async function() {
      let cmp = await blobCompare.bytesEqualWithArrayBuffer(dataset.get('jpg1'), dataset.get('jpg1'));

      cmp.should.be.true;
    })

    it('should return false if bytes are not equal', async function() {
      let cmp = await blobCompare.bytesEqualWithArrayBuffer(dataset.get('jpg1'), dataset.get('jpg2'));

      cmp.should.be.false;
    })
  });

  /** @test {blobCompare.isEqual} */
  describe('isEqual', function() {
    // build a dataset to run test automatically, [b1, b2, expected, size]
    const suite = [
      ['empty', 'empty', true],
      ['empty', 'smallA', false],
      ['smallA', 'smallA', true],
      ['smallA', 'smallB', false],
      ['midA', 'midAB', false],
      ['jpg1', 'jpg1', true],
      ['jpg1', 'jpg2', false],
      ['jpg1', 'jpg2', true, {methods: ['types']}], // Types are the same
      ['jpg1', 'jpg2', true, {partial: true}], // Types are the same so partial succeeds
      ['png1', 'png1', true],
      ['png1', 'png2', false],
      ['png1', 'png2', true, {methods: ['magic']}], // Magic numbers are the same
      ['png1', 'png2', true, {methods: ['magic', 'size'], partial: true}], // Magic numbers are the same
      ['bmp1', 'bmp1', true],
      ['bmp1', 'bmp2', false],
      ['bmp1', 'bmp2', true, {sizes : [512]}], // Sample size is too small to see difference between the two files
      ['bmp1', 'bmp2', false, {methods: ['bytes']}], // Force using only blob size
      ['bmp1', 'bmp2', false, {methods: ['bytes'], byte: 'string'}], // Force using only blob size with binary string
      ['bmp1', 'bmp2', true, {methods: ['size']}], // Sizes are the same though files are different
      ['jpg1', 'png1', false],
    ]

    for (let t of suite) {
      const [n1, n2, expected, options] = t;

      it(`should return ${expected} with ${n1} vs ${n2} and ${options ? JSON.stringify(options) : 'default options'}`, async function() {
          const res = await blobCompare.isEqual(dataset.get(n1), dataset.get(n2), options);

          expect(res).to.equal(expected);
      })
    }

    it('should throw if one method is not recognized', async function() {
      try {
        await blobCompare.isEqual(dataset.get('jpg1'), dataset.get('jpg2'), {methods: ['silly']});
        expect.fail();
      } catch (err) {
        err.message.should.equal('Unknown comparison method');
      }
    })
  });
});
