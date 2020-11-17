import * as fsPromise from 'fs/promises';
import { exit } from 'process';
import * as path from 'path';
import servantBrief from 'src/lib/servantBrief';

const liePath = path.join(__dirname, './../../images/lie/');

const main = async () => {
  const downloadedNames = await fsPromise.opendir(liePath).then(async dir => {
    const res: string[] = [];
    for await (const dirent of dir) {
      res.push(dirent.name);
    }
    return res;
  });

  const noLies = servantBrief.data.filter(
    ({ name_link }) => !downloadedNames.includes(name_link)
  );
  console.log(noLies.map(val => val.id));
  exit();
};

main();
