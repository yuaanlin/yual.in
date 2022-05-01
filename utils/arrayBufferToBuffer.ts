function arrayBufferToBuffer(ab: ArrayBuffer) {
  const b = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < b.length; ++i) {
    b[i] = view[i];
  }
  return b;
}

export default arrayBufferToBuffer;
