import imageManager from 'src/lib/imageManager';
import servantBrief from 'src/lib/servantBrief';

const data = servantBrief.data;

imageManager.update(data).then(() => console.log('更新完成'));
