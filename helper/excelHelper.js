import Excel from 'exceljs';

const FILES = {
	source: './store/form1.xlsx',
	result: './store/result.xlsx',
	default: './store/default.json'
}

const CELLS = {
	month: 'D2',
	drillingRig: 'D4',
	field: 'D5',
	bush: 'D6'
}

const workbook = new Excel.Workbook();
let sheet = undefined;

const readSheet = async (filename) => {
	await workbook.xlsx.readFile(filename);
	sheet = workbook.getWorksheet(1);
}

const writeSheet = async (filename) => {
	await workbook.xlsx.writeFile(filename);
}

const writeCell = (cell, value) => {
	sheet.getCell(cell).value = value;
}

export { readSheet, writeSheet, FILES, writeCell, CELLS };