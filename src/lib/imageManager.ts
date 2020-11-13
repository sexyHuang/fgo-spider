import * as fs from 'fs/promises';
import * as path from 'path';
import imageMap from 'output/imageMap';
import { BASE_PATH, LocalPath } from 'src/const';
import { ServantBriefObj } from 'src/types';
import getImageMapString from 'src/dataStr/getImageMapString';
import download from './download';

const getType = (key: string) => {
  if (/^card[1-5]$/.test(key)) return 'card';
  return key;
};
const tagetKeys = [
  'avatar',
  'card1',
  'card2',
  'card3',
  'card4',
  'card5',
  'np_card',
  'class_icon'
];
const cachePath = path.join(LocalPath.DataPath, 'imageMap.ts');

class ImageManager {
  private map = imageMap;
  private save() {
    const { map } = this;
    return fs.writeFile(cachePath, getImageMapString([...map]), 'utf-8');
  }
  async update(data: ServantBriefObj[]) {
    const { map } = this;
    let hasChange = false;
    for (let item of data) {
      for (let key of tagetKeys) {
        const val = item[key] as string;
        if (map.has(val)) continue;
        hasChange = true;
        val &&
          map.set(val, {
            url: `${BASE_PATH}${val}`,
            type: getType(key)
          });
      }
    }
    hasChange && (await this.save());
  }
  getUnDownloadList() {
    return [...this.map].filter(item => !item[1].localPath);
  }
  async downloadCachedImages(patchSize = 10) {
    console.log('批量下载任务开始...');

    const imgs2Download = this.getUnDownloadList();
    const total = imgs2Download.length;
    let successCount = 0;
    let startIdx = 0;
    while (startIdx < total) {
      const endIdx = startIdx + patchSize;
      const promiseList = imgs2Download.slice(startIdx, endIdx).map(val => {
        const [key, { url, type }] = val;
        return this.downloadImage(url, type, key.split('/').pop()!)
          .then(res => {
            console.log(key, '下载成功');
            successCount += 1;
            this.map.set(key, {
              url,
              type,
              localPath: res
            });
          })
          .catch(res => {
            console.log(res);
            console.log(key, '下载失败。');
          });
      });
      try {
        await Promise.all(promiseList);
      } catch (e) {
        // do nothing
      }

      startIdx = endIdx;
    }
    successCount && (await this.save());
    console.log(
      `下载任务完成，共${total}张图片待下载，成功下载${successCount}张。`
    );
  }
  async downloadImage(url: string, _path: string, filename: string) {
    const targetPath = path.join(LocalPath.ImagePath, _path);
    await fs.mkdir(targetPath, { recursive: true });
    return download(url, path.join(targetPath, filename));
  }
}

const imageManager = new ImageManager();
export default imageManager;
