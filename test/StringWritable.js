import stream, { Writable } from "stream";
import { StringDecoder } from "string_decoder";

class StringWritable extends Writable {
  /**
   * @param {stream.WritableOptions} [options]
   */
  constructor(options) {
    super(options);

    /** @readonly @type {StringDecoder} */
    this._decoder = new StringDecoder(options?.defaultEncoding);

    /** @type {string} */
    this.data = "";
  }

  /** @type {(chunk: Buffer | string, encoding: BufferEncoding, callback: (error?: Error | null) => void) => void} */
  _write(chunk, _, callback) {
    if (typeof chunk !== "string") {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }

  /** @type {(callback: (error?: Error | null) => void) => void} */
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

export default StringWritable;
