import stream from "stream";

class LineNumberTransformer extends stream.Transform {
  constructor() {
    super();

    this._lineNum = 1;
    this._buffer = "";
  }

  /** @type {(chunk: any, encoding: BufferEncoding, callback: stream.TransformCallback) => void} */
  _transform(chunk, _, cb) {
    try {
      this._processNextChunk(chunk.toString("utf8"));
      cb();
    } catch (err) {
      cb(err);
    }
  }

  /** @type {(callback: stream.TransformCallback) => void} */
  _flush(cb) {
    if (this._buffer.length > 0) {
      this.push(`${this._lineNum} ${this._buffer}`);
    }
    cb();
  }

  /** @type {(chunk: string) => void} */
  _processNextChunk(chunk) {
    this._buffer += chunk;

    let lineIdx = -1;
    while ((lineIdx = this._buffer.indexOf("\n")) !== -1) {
      const line = this._buffer.slice(0, lineIdx + 1);
      this._buffer = this._buffer.slice(lineIdx + 1);
      this.push(`${this._lineNum} ${line}`);
      this._lineNum += 1;
    }
  }
}

export default LineNumberTransformer;
