import * as puppeteer from 'puppeteer';
import  * as fs from 'fs/promises';

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://fgo.wiki/w/%E8%8B%B1%E7%81%B5%E5%9B%BE%E9%89%B4');
  const windowHandle = await page.evaluateHandle(() => window);
  windowHandle.getProperty('csv_data').then(async res => {
    const brifeJson = await res.jsonValue();
    await fs.writeFile(
      './output/brifeJson.json',
      JSON.stringify(brifeJson),
      'utf-8'
    );
    console.log('success');
  });
}

main();
