import * as fsn from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import imageMap from 'output/imageMap';
import { BASE_PATH, LocalPath } from 'src/const';
import { ServantBriefObj } from 'src/types';
import getImageMapString from 'src/dataStr/getImageMapString';
import { download2 } from './download';
import ServantDetails from './ServantDetails';

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

  get size() {
    return this.map.size;
  }
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
  async updateLie({ name_link }: ServantBriefObj) {
    const { map } = this;
    let hasChange = false;
    const servantDetail = new ServantDetails(name_link);
    const srcs = await servantDetail.getServantLieImages();
    console.log(srcs);
    for (let src of srcs) {
      if (!src || map.has(src)) continue;
      hasChange = true;
      map.set(src, {
        url: `${BASE_PATH}${src}`,
        type: `lie/${name_link}`
      });
    }
    console.log(`${name_link}立绘数据抓取完成`);

    servantDetail.closePage();
    return hasChange;
  }

  async updateLies(datas: ServantBriefObj[], patchSize = 10) {
    console.log('开始缓存立绘数据...');
    let startIdx = 0;
    let total = datas.length;
    let hasChange = false;
    let i = 0;
    while (startIdx < total) {
      const endIdx = startIdx + patchSize;
      const promiseList = datas.slice(startIdx, endIdx).map(obj =>
        this.updateLie(obj).then(changed => {
          hasChange = changed;
        })
      );
      try {
        await Promise.all(promiseList);
        hasChange && (await this.save());
        console.log(`第${i++}批数据缓存完成。`);
        hasChange = false;
      } catch (e) {
        // do nothing
      }
      startIdx = endIdx;
    }
    console.log('立绘数据缓存完成。');
  }
  getUnDownloadList() {
    return [...this.map].filter(item => !item[1].localPath);
  }
  async downloadCachedImages(patchSize = 10) {
    console.log('批量下载任务开始...');
    const SAVE_PATCH_SIZE = 50;
    const imgs2Download = this.getUnDownloadList();
    const total = imgs2Download.length;
    let successCount = 0;
    let lastSaveCount = 0;
    let startIdx = 0;
    let i = 0;
    while (startIdx < total) {
      const endIdx = startIdx + patchSize;
      const promiseList = imgs2Download.slice(startIdx, endIdx).map(val => {
        const [key, { url, type }] = val;
        return this.downloadImage(url, type, key.split('/').pop()!)
          .then(res => {
            console.log(decodeURI(key), '下载成功');
            successCount += 1;
            this.map.set(key, {
              url,
              type,
              localPath: res
            });
          })
          .catch(res => {
            console.log(res);
            console.log(decodeURI(key), '下载失败。');
          });
      });
      try {
        await Promise.all(promiseList);
        if (successCount - lastSaveCount >= SAVE_PATCH_SIZE) {
          await this.save();
          lastSaveCount = successCount;
          console.log(`第${i++}批下载完成已记录。`);
        }
      } catch (e) {
        // do nothing
      }

      startIdx = endIdx;
    }
    successCount - lastSaveCount > 0 && (await this.save());
    console.log(
      `下载任务完成，共${total}张图片待下载，成功下载${successCount}张。`
    );
  }
  async downloadImage(url: string, _path: string, filename: string) {
    const targetPath = path.join(LocalPath.ImagePath, _path);
    const downloadPath = path.join(targetPath, filename);
    const exist = fsn.existsSync(downloadPath);
    if (exist) return downloadPath;
    await fs.mkdir(targetPath, { recursive: true });
    return download2(url, downloadPath);
  }
}

const imageManager = new ImageManager();
export default imageManager;
