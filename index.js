import { FILES, readSheet, writeSheet } from './helper/excelHelper.js';
import * as cons from './helper/consoleHelper.js'

await cons.greating();

await readSheet(FILES.source)
await cons.setDrillingRig()
await cons.setMonth();

await writeSheet(FILES.result);
cons.goodbuy();
