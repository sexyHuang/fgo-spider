import { exit } from 'process';
import servantBrief from 'src/lib/servantBrief';

async function main() {
  console.log(servantBrief.data);
  exit();
}

main();
