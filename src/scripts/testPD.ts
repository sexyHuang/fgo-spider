import PatchDownloader from 'src/lib/PatchDownloader';

const downloader = (id: number) => {
  return new Promise<{ id: number }>(resolve => {
    console.log(`${id}.正在下载...`);
    setTimeout(() => {
      resolve({ id });
    }, Math.round(Math.random() * 5000));
  });
};

const patchDownloader = new PatchDownloader(downloader);

for (let i = 0; i < 100; i++) {
  patchDownloader.download(i).then(res => {
    console.log(`${res.id}.下载完成。`);
  });
}
