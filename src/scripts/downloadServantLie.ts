// import servantBrief from 'src/lib/servantBrief';

import { exit } from 'process';
// import servantBrief from 'src/lib/servantBrief';
import imageManager from '../lib/imageManager';

imageManager.downloadCachedImages().finally(() => {
  exit();
});

/* imageManager.updateLies(servantBrief.data.slice(20)).finally(() => {
  exit();
}); */
