import { PARAMS, readData, getKeyValue } from "../services/storage.service.js";
import moment from 'moment'

const month = await getKeyValue(PARAMS.month);
const year = await getKeyValue(PARAMS.year);
const days = 32 - new Date(year, month - 1, 32).getDate();

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

const keys = {
	maxWells: 4,
	maxRow: 21,
	firstRow: 10,
	stage: ['prepare', 'build'],
	day: 'E F G H I J K L M N O P Q R S T U V W X Y Z AA AB AC AD AE AF AG AH AI'.split(' '),
}

const CELLS = {
	month: 'D2',
	typeNumber: 'D4',
	year: 'E2',
	field: 'D5',
	bush: 'D6'
}


//Возвращаем двумерный массив 31*2, соответствующий часам работы на каждый день, -1 - нерабочий день 23 - полный рабочий день
const getHoursOfWork = (start, end) => {
	//Создание массива
	const hours = [];
	for (let i = 0; i < 31; i++) {
		hours.push([-1, 23]);
	}
	//Проверка что работы начались в отчетном месяце и задание старта работ в первый день
	let dayStart = start.date();
	if (start.isBefore(`${year}-${month < 10 ? '0' + month : month}-01`)) {
		dayStart = 1;
		hours[0][0] = 0;
	} else {
		hours[dayStart - 1][0] = start.hour();
	}
	//Проверка что работы закончились в текущем месяце и задание окончания работ последнего дня 

	let dayEnd = end.date();
	if (end.isAfter(`${year}-${month < 10 ? '0' + month : month}-${days}`)) {
		dayEnd = days;
	} else {
		hours[dayEnd - 1][1] = end.hour() - 1;//отнимаем час так как работы уже закончились!!!!!!!!
	}
	//Задание начала работ для промежуточных и последнего дня
	for (let i = dayStart; i < dayEnd; i++) {
		if (hours[i][1] != -1) { //Проверка что работы не закончились в полночь!!!!!
			hours[i][0] = 0;
		}
	}
	return hours;
}

const setSheet = async (sheet, wells, power) => {

	// Устанавливаем общие данные
	const data = await readData();
	sheet.getCell(CELLS.month).value = MONTH[data[PARAMS.month]];
	sheet.getCell(CELLS.year).value = `Месяц ${data[PARAMS.year]} года`;
	sheet.getCell(CELLS.typeNumber).value = `${data[PARAMS.type]}, зав №${data[PARAMS.number]}`;
	sheet.getCell(CELLS.field).value = data[PARAMS.field];
	sheet.getCell(CELLS.bush).value = data[PARAMS.bush];

	//Срезаем лишние строки из таблицы
	const sliceCount = (keys.maxWells - wells.length) * 3;
	const endRow = keys.maxRow - sliceCount + 1;
	sheet.spliceRows(endRow, sliceCount);

	//Восстанавливем свойства объединенных ячеек
	sheet.unMergeCells(`B${28 - sliceCount}:D${28 - sliceCount}`);
	sheet.mergeCells(`B${28 - sliceCount}:D${28 - sliceCount}`);
	sheet.unMergeCells(`B${31 - sliceCount}:D${31 - sliceCount}`);
	sheet.mergeCells(`B${31 - sliceCount}:D${31 - sliceCount}`);
	sheet.unMergeCells(`B${34 - sliceCount}:D${34 - sliceCount}`);
	sheet.mergeCells(`B${34 - sliceCount}:D${34 - sliceCount}`);
	sheet.unMergeCells(`B${37 - sliceCount}:D${37 - sliceCount}`);
	sheet.mergeCells(`B${37 - sliceCount}:D${37 - sliceCount}`);
	sheet.unMergeCells(`B${38 - sliceCount}:D${38 - sliceCount}`);
	sheet.mergeCells(`B${38 - sliceCount}:D${38 - sliceCount}`);
	sheet.unMergeCells(`B${40 - sliceCount}:D${40 - sliceCount}`);
	sheet.mergeCells(`B${40 - sliceCount}:D${40 - sliceCount}`);
	sheet.unMergeCells(`L${32 - sliceCount}:P${32 - sliceCount}`);
	sheet.mergeCells(`L${32 - sliceCount}:P${32 - sliceCount}`);
	sheet.unMergeCells(`L${35 - sliceCount}:P${35 - sliceCount}`);
	sheet.mergeCells(`L${35 - sliceCount}:P${35 - sliceCount}`);
	sheet.unMergeCells(`AH${22 - sliceCount}:AI${22 - sliceCount}`);
	sheet.mergeCells(`AH${22 - sliceCount}:AI${22 - sliceCount}`);

	const month = await getKeyValue(PARAMS.month);
	const year = await getKeyValue(PARAMS.year);



	//Заполняем данные по скважинам
	for (let i = 0; i < wells.length; i++) {
		const number = (wells[i][wells[i].prepare ? 'prepare' : 'build'].number);
		sheet.getCell(`A${10 + 3 * i}`).value = number;
		//заполняем пзр и бурение одинаково, 0- пзр, 1 - бурение
		for (let k = 0; k < keys.stage.length; k++) {
			if (wells[i][keys.stage[k]]) {
				//начало работ
				let start = wells[i][keys.stage[k]].start
				sheet.getCell(`C${keys.firstRow + k + 3 * i}`).value = start;
				start = moment(start);
				//окончание работ
				let end = wells[i][keys.stage[k]].end;
				sheet.getCell(`D${keys.firstRow + k + 3 * i}`).value = /^3000.*/.test(end) ? 'переход' : end;
				end = moment(end);
				//потребленная мощность
				const hours = getHoursOfWork(start, end, month, year);
				for (let d = 0; d < hours.length; d++) { //d - будет соответствовать (дню месяца - 1)
					if (hours[d][0] == -1) continue;
					//отрезаем нужный массив энергии и суммируем
					let pow = power[d].slice(hours[d][0], hours[d][1] + 1).reduce((s, p) => s + p);
					sheet.getCell(`${keys.day[d]}${keys.firstRow + k + 3 * i}`).value = Math.round(pow);
				}
			}
		}
	}
}

export { setSheet }