import Excel from 'exceljs';

const FILES = {
	source: './store/test.xlsx',
	result: './store/result.xlsx',
}

const CELLS = {
	month: 'D2',
	type: ''
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