import axios from 'axios';
import * as fs from 'fs';
import { Stream } from 'stream';
const download = async (url: string, path: string) => {
  const writer = fs.createWriteStream(path);
  console.log(path);
  const res = await axios.get<Stream>(encodeURI(url), {
    responseType: 'stream'
  });
  res.data.pipe(writer);
  return path;
};

export default download;
