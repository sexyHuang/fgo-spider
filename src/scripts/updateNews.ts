import { exit } from 'process';
import imageManager from 'src/lib/imageManager';
import servantBrief from 'src/lib/servantBrief';

const main = async () => {
  await servantBrief.update();
  const { newData } = servantBrief;
  if (newData.length <= 0) {
    console.log('暂无更新。');
  } else {
    await imageManager.update(newData);
    await imageManager.updateLies(newData);
    await imageManager.downloadCachedImages();
  }
  exit();
};

main();
