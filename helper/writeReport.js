import Excel from 'exceljs';
import { homedir } from 'os'
import { join } from 'path'
import { printSucces, printError } from '../services/log.service.js';
import { PARAMS, readData } from '../services/storage.service.js';

const MONTH = {
	1: 'январь',
	2: 'февраль',
	3: 'март',
	4: 'апрель',
	5: 'май',
	6: 'июнь',
	7: 'июль',
	8: 'август',
	9: 'сентябрь',
	10: 'октябрь',
	11: 'ноябрь',
	12: 'декабрь'
}

const CELLS = {
	month: 'D2',
	typeNumber: 'D4',
	year: 'E2',
	field: 'D5',
	bush: 'D6'
}

const templatePath = './template.xlsx';
const resultPath = join(homedir(), '/report.xlsx');

const writeReport = async () => {
	try {
		const data = await readData();

		const workbook = new Excel.Workbook();
		await workbook.xlsx.readFile(templatePath);
		const sheet = workbook.getWorksheet(1);

		sheet.getCell(CELLS.month).value = MONTH[data[PARAMS.month]];
		sheet.getCell(CELLS.year).value = `Месяц ${data[PARAMS.year]} года`;
		sheet.getCell(CELLS.typeNumber).value = `${data[PARAMS.type]}, зав №${data[PARAMS.number]}`;
		sheet.getCell(CELLS.field).value = data[PARAMS.field];
		sheet.getCell(CELLS.bush).value = data[PARAMS.bush];

		await workbook.xlsx.writeFile(resultPath);
		printSucces(' Отчет создан. Заберите report.xlsx из рабочей директории')
	} catch (error) {
		printError(error.message);
	}
}

export { writeReport };