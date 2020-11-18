import { exit } from 'process';
import imageManager from 'src/lib/imageManager';

console.log('task start.');
imageManager.formateLie().then(() => {
  console.log('task finish.');
  exit();
});
