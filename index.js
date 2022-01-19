import { FILES, readSheet, writeSheet } from './helper/excelHelper.js';
import * as cons from './helper/consoleHelper.js'
import moment from 'moment'

// await cons.greating();

// await readSheet(FILES.source)
// await cons.setDrillingRig()
// await cons.setFieldBush()
// await cons.setMonth();

// await writeSheet(FILES.result);
cons.goodbuy();

const start = moment("2021-01-23 11");
console.log(start.hour());