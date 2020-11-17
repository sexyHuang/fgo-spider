class PatchDownloader<T extends (...args: any[]) => Promise<any>> {
  private patchSize: number;
  private requestingCount = 0;
  private queue: any[] = [];
  private downloader: T;
  constructor(downloader: T, patchSize = 10) {
    this.patchSize = patchSize;
    this.downloader = downloader;
  }
  download(...args: Parameters<T>): ReturnType<T> {
    const { requestingCount, patchSize } = this;
    if (requestingCount < patchSize) {
      this.requestingCount += 1;
      return this.downloader(...args).finally(() => {
        this.requestingCount -= 1;
        this.queue.shift()?.();
      }) as any;
    } else {
      return this.downloadWhenIdle(...args) as any;
    }
  }
  private downloadWhenIdle(...args: Parameters<T>) {
    return new Promise((resolve, reject) => {
      const cb = async () => {
        try {
          const res = await this.download(...args);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      };
      this.queue.push(cb);
    });
  }
}

export default PatchDownloader;
