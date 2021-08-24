import { exit } from 'process';
import genBriefJson from 'src/lib/genBriefJson';

import imageManager from 'src/lib/imageManager';
import servantBrief from 'src/lib/servantBrief';

const main = async () => {
  // 检查从者目录是否有更新
  await servantBrief.update();
  const { newData } = servantBrief;
  if (newData.length <= 0) {
    console.log('暂无更新。');
  } else {
    // 更新目录图片
    await imageManager.update(newData);
    // 更新从者立绘
    await imageManager.updateLies(newData);
    // 下载已获取图片
    await imageManager.downloadCachedImages();
    // 生成简要列表JSON（图片路径为本地路径）
    await genBriefJson();
  }
  exit();
};

main();
