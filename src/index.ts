import { exit } from 'process';
import genBriefJson from './lib/genBriefJson';

async function main() {
  await genBriefJson();
  exit();
}

main();
