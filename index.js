import { FILES, readSheet, writeSheet } from './helper/excelHelper.js';
import * as cons from './helper/consoleHelper.js'

cons.greating();

await readSheet(FILES.source)
await cons.setMonth();

await writeSheet(FILES.result);
cons.goodbuy();
