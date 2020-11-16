import * as puppeteer from 'puppeteer';
import { BASE_PATH } from '../const';

const browser = puppeteer.launch();

class ServantDetails {
  private pagePromise: Promise<puppeteer.Page>;
  constructor(name_link: string) {
    this.openDetailPage(name_link);
  }

  openDetailPage(name_link: string) {
    console.log(`正在连接${name_link}的详情页`);
    const url = `${BASE_PATH}w/${encodeURIComponent(name_link)}`;
    this.pagePromise = browser.then(browser =>
      browser.newPage().then(async page => {
        await page.goto(url);
        console.log(`${name_link}的详情页打开成功`);

        return page;
      })
    );
  }
  async getServantLieImages() {
    const page = await this.pagePromise;
    const lieContainer = await page.$('.graphpicker');
    if (lieContainer) {
      const srcs = await lieContainer.$$eval('img', nodes => {
        return nodes.map(
          node => node.getAttribute('data-srcset')?.split(/,|\s/)[3] ?? ''
        );
      });
      return srcs;
    }
    const srcs = await page.$$eval('img[width="285"]', nodes => {
      const res: string[] = [];
      for (let i = 0; i < nodes.length / 2; i++) {
        res.push(nodes[i].getAttribute('data-srcset')?.split(/,|\s/)[3] ?? '');
      }
      return res;
    });
    return srcs;
  }
  async closePage() {
    (await this.pagePromise).close();
  }
}

export default ServantDetails;
