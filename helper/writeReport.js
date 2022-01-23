import Excel from 'exceljs';
import { homedir } from 'os'
import { dirname, join } from 'path'
import { printSucces, printError } from '../services/log.service.js';
import { setSheet } from './setSheet.js';
import { getSortedWells } from "../services/storage.service.js";
import { getPower } from './getPower.js';
import { fileURLToPath } from 'url'

//Получаем путь к текущему каталогу и определяем где находится наш шаблон
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatePath = join(__dirname, '../template.xlsx');

const resultPath = join(homedir(), '/report.xlsx');

const powerPath = join(homedir(), '/power.txt');

const writeReport = async () => {
	try {
		//Создаем лист отчета
		const workbook = new Excel.Workbook();
		await workbook.xlsx.readFile(templatePath);
		const sheet = workbook.getWorksheet(1);

		//получаем данные для отчета
		const wells = await getSortedWells();
		const power = await getPower(powerPath);

		//записываем данные в отчет
		await setSheet(sheet, wells, power);

		//Сохраняем файл
		await workbook.xlsx.writeFile(resultPath);
		printSucces(' Отчет создан. Заберите report.xlsx из рабочей директории')
	} catch (error) {
		printError(`Не удалось создать отчет, убедитесь что заданы все данные, 
для проверки используйте команду: report -v`);
	}
}

export { writeReport, powerPath };