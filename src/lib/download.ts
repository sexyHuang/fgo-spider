import axios from 'axios';
import * as fs from 'fs';
import * as fsPromise from 'fs/promises';
import * as https from 'https';
import { Stream } from 'stream';
const download = async (url: string, path: string) => {
  const decodePath = decodeURI(path);
  const writer = fs.createWriteStream(decodeURI(decodePath), {
    encoding: 'binary'
  });
  console.log(url);
  const res = await axios.get<Stream>(encodeURI(url), {
    responseType: 'stream',
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'max-age=0',
      'if-modified-since': 'Wed, 01 Apr 2020 02:18:15 GMT',
      'if-none-match': '"5e83f9e7-3e52c"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      cookie: '_ga=GA1.2.84933448.1605168129; _gid=GA1.2.363375756.1605508296'
    }
  });

  res.data.pipe(writer);
  return decodePath;
};

export const download2 = (url: string, path: string) => {
  const decodePath = decodeURI(path);
  return new Promise<string>((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'zh-CN,zh;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          cookie:
            '_ga=GA1.2.1570320758.1605598082; _gid=GA1.2.960189464.1605598082; __cfduid=dbd3d3b55985d6e83ea416e6f18e5015f1605598090; Hm_lvt_b09a6e73b4faec9edd5935dc45604b5b=1605598082,1605606838; Hm_lpvt_b09a6e73b4faec9edd5935dc45604b5b=1605606885'
        }
      },
      res => {
        let imgData = '';
        res.setEncoding('binary');
        res.on('data', chunk => (imgData += chunk));
        res.on('end', () => {
          fsPromise.writeFile(decodePath, imgData, 'binary').then(() => {
            resolve(decodePath);
          });
        });
        res.on('error', reject);
      }
    );
  });
};

export default download;
