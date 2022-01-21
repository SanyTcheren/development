import Excel from 'exceljs';
import { homedir } from 'os'
import { join } from 'path'
import { printSucces, printError } from '../services/log.service.js';
import { getTemplate } from './getTemplate.js';
import { setSheet } from './setSheet.js';
import { getSortedWells } from "../services/storage.service.js";
import { setWells } from './setWells.js';


const getTempl = (wells) => {
	return wells.reduce((r, w) => {
		if (!w.prepare) {
			return r + 's';
		} else if (/^3000.*/.test(w.build.end)) {
			return r + 'e';
		} else {
			return r + 'a';
		}
	}, '');
}

const templatePath = './templates/template.xlsx';

const resultPath = join(homedir(), '/report.xlsx');

const writeReport = async () => {
	try {
		const workbook = new Excel.Workbook();
		await workbook.xlsx.readFile(templatePath);
		const sheet = workbook.getWorksheet(1);

		const wells = await getSortedWells();
		const templ = getTempl(wells);
		const template = await getTemplate(templ);
		await setSheet(sheet, template);
		await setWells(sheet, wells);

		await workbook.xlsx.writeFile(resultPath);
		printSucces(' Отчет создан. Заберите report.xlsx из рабочей директории')
	} catch (error) {
		printError(error.message);
	}
}




export { writeReport };