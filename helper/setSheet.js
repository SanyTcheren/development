import { PARAMS, readData } from "../services/storage.service.js";

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

const setSheet = async (sheet, template) => {

	const data = await readData();
	sheet.getCell(CELLS.month).value = MONTH[data[PARAMS.month]];
	sheet.getCell(CELLS.year).value = `Месяц ${data[PARAMS.year]} года`;
	sheet.getCell(CELLS.typeNumber).value = `${data[PARAMS.type]}, зав №${data[PARAMS.number]}`;
	sheet.getCell(CELLS.field).value = data[PARAMS.field];
	sheet.getCell(CELLS.bush).value = data[PARAMS.bush];

	if (!template) return;

	for (let i = 0; i < template.rowDel.length; i++) {
		sheet.spliceRows(template.rowDel[i][0], template.rowDel[i][1]);
	}

	for (let i = 0; i < template.cellUnMerge.length; i++) {
		sheet.unMergeCells(template.cellUnMerge[i])
	}
	for (let i = 0; i < template.cellMerge.length; i++) {
		console.log(template.cellMerge[i]);
		sheet.mergeCells(template.cellMerge[i]);
	}

}

export { setSheet }