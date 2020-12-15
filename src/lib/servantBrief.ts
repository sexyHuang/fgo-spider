import * as puppeteer from 'puppeteer';
import { BASE_PATH, DataKey, LocalPath, Path } from '../const';
import oldData from '../../output/briefJson';
import { ServantBriefObj } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';
import getServantBriefCacheString from 'src/dataStr/getServantBriefCacheString';
type T = ServantBriefObj[];

const itemTransformer = (value: string) => {
  if (value === '—') return null;

  return !value || isNaN(Number(value)) ? value : Number(value);
};
const cachePath = path.join(LocalPath.DataPath, 'briefJson.ts');

type StringMap = { [key in keyof ServantBriefObj]: string };
const getOriginBriefData = async () => {
  console.log('启动浏览器...');
  const browser = await puppeteer.launch();
  console.log('打开Index页...');
  const page = await browser.newPage();
  await page.goto(`${BASE_PATH}${Path.IndexPage}`);
  console.log('获取数据...');
  const windowHandle = await page.evaluateHandle(() => window);
  const dataHandle = await windowHandle.getProperty(DataKey.indexData);
  const res = (await dataHandle.jsonValue()) as StringMap[];
  console.log('原始数据获取完成。');
  return res;
};

const dataTranformer = (input: StringMap[]) => {
  return input.map(val => {
    const newObj: any = {};
    for (let [key, value] of Object.entries(val)) {
      if (value !== undefined) newObj[key] = itemTransformer(value);
    }
    return newObj;
  }) as ServantBriefObj[];
};

class ServantBrief {
  private oldData = oldData;
  private _data = oldData;
  private addData: T = [];
  private setAddData(newData: T) {
    const newAddData = newData.filter(
      val => !this.oldData.some(oldVal => oldVal.id === val.id)
    );

    this.addData = newAddData;
  }
  private setData(data: T) {
    this.setAddData(data);
    this.oldData = this._data;
    this._data = data;
  }
  private async save() {
    const { _data: data } = this;
    await fs.writeFile(cachePath, getServantBriefCacheString(data), 'utf-8');
  }

  async update() {
    console.log('从者目录开始更新...');
    const originData = await getOriginBriefData();
    const newData = dataTranformer(originData);
    console.log('数据转换完成。');
    this.setData(newData);
    console.log('开始缓存数据...');
    await this.save();
    console.log(`从者目录开始更新完毕，新增${this.addData.length}条记录！`);
  }

  resetCache() {
    return fs.writeFile(cachePath, getServantBriefCacheString([]), 'utf-8');
  }

  get newData() {
    return this.addData;
  }
  get data() {
    return this._data;
  }
}

const servantBrief = new ServantBrief();
export default servantBrief;
