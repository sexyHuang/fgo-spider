import servantBrief from '../lib/servantBrief';

servantBrief.resetCache().then(() => {
  console.log('缓存清理完成。');
});
