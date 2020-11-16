import * as puppeteer from 'puppeteer';

class Brower {
  private browerPromise;
  constructor() {
    this.browerPromise = puppeteer.launch();
  }
  brower() {
    return this.browerPromise;
  }
  async page() {}
}
