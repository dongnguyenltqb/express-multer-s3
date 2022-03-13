// https://github.com/expressjs/multer/blob/master/StorageEngine.md
import fs from "fs";
import util from "util";
import { pipeline } from "stream";
import path from "path";

const pump = util.promisify(pipeline);

type KeyGenFn = (name: string) => string;

class S3MulterStorage {
  bucket: string;
  keyGen: (name: string) => string;

  constructor(bucket: string, keyGen: KeyGenFn) {
    this.bucket = bucket;
    this.keyGen = keyGen;
  }
  public async _handleFile(req, file, cb) {
    try {
      console.log(req.body);
      // file.stream
      const filePath = path.join(
        process.cwd(),
        "./uploaded/" +
          Math.random().toString(32).slice(2, 15) +
          file.originalname
      );
      // upload to s3 here
      await pump(file.stream, fs.createWriteStream(filePath));
      cb(null, {
        path: filePath,
      });
    } catch (error) {
      cb(error);
    }
  }
  public async _removeFile(req, file, cb) {
    try {
      // remove key on s3
      fs.unlinkSync(file.path);
    } catch (err) {
      cb(err);
    }
  }
}

export default S3MulterStorage;

/*

var formdata = new FormData();
formdata.append("address", "123");
formdata.append("version", "1");
formdata.append("avatar", fileInput.files[0], "protobuf-all-3.19.4.zip");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("localhost:3000/upload", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
*/
