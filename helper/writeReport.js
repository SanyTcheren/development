import Excel from 'exceljs';
import { homedir } from 'os'
import { join } from 'path'
import { printSucces, printError } from '../services/log.service.js';
import { getTemplate } from './getTemplate.js';
import { setSheet } from './setSheet.js';



const templatePath = './templates/template.xlsx';

const resultPath = join(homedir(), '/report.xlsx');

const writeReport = async () => {
	try {
		const workbook = new Excel.Workbook();
		await workbook.xlsx.readFile(templatePath);
		const sheet = workbook.getWorksheet(1);

		const template = getTemplate();
		await setSheet(sheet, template);

		await workbook.xlsx.writeFile(resultPath);
		printSucces(' Отчет создан. Заберите report.xlsx из рабочей директории')
	} catch (error) {
		printError(error.message);
	}
}



export { writeReport };