import * as fs from 'fs/promises';
import * as path from 'path';
import imageManager from 'src/lib/imageManager';
import { LocalPath } from 'src/const';
import servantBrief from 'src/lib/servantBrief';
import { Keys, ServantBriefObj } from 'src/types';

const briefList = path.join(LocalPath.DataPath, 'briefList.json');

const imagesKeys = Object.entries(servantBrief.data[0])
  .filter(([_, value]) => {
    return `${value}`.includes('/images/');
  })
  .map(([key]) => key) as Keys<ServantBriefObj, string>[];

export default function genBriefJson() {
  return fs.writeFile(
    briefList,
    JSON.stringify(
      servantBrief.data.map(item => {
        for (let key of imagesKeys) {
          item[key] =
            imageManager
              .get(item[key])
              ?.localPath?.replace(/.+(\\images.+)/, '$1')
              .replace(/\\/g, '/') ?? item[key];
        }
        return item;
      })
    ),
    'utf-8'
  );
}
