import yargs from "yargs";
import { writeReport } from "./helper/writeReport.js";
import { printData, printHelp, printError, printSucces, printGuide } from "./services/log.service.js";
import { getKeyValue, PARAMS, saveKeyValue } from "./services/storage.service.js";
import moment from "moment";

const countDaysOfMonth = (year, month) => {
	return 32 - new Date(year, month - 1, 32).getDate();
}

const saveTypeNumber = (type, number) => {
	if (!type.length) {
		printError(' Не передан тип буровой установки')
		return;
	}
	if (number.length == 0) {
		printError(' Не передан номер буровой установки');
		return;
	}
	try {
		saveKeyValue([PARAMS.type, PARAMS.number], [type, number[0]]);
		printSucces(' Тип и номер буровой установки сохранены')
	} catch (error) {
		printError(error.message)
	}
}

const saveFieldBush = (field, bush) => {
	if (!field.length) {
		printError(' Не передано название месторождения ')
		return;
	}
	if (bush.length == 0) {
		printError(' Не передан номер куста');
		return;
	}
	try {
		saveKeyValue([PARAMS.field, PARAMS.bush], [field, bush[0]]);
		printSucces(' Название месторождения и номер куста сохранены')
	} catch (error) {
		printError(error.message)
	}
}

const saveMonth = (month) => {
	if (!(month > 0 && month <= 12)) {
		printError(' Не передан номер месяца в году. Задайте число от 1 до 12. ')
		return;
	}
	try {
		saveKeyValue([PARAMS.month], [month]);
		printSucces(' Номер месяца сохранен')
	} catch (error) {
		printError(error.message)
	}
}

const saveYear = (year) => {
	if (!(year > 2020 && year < 2030)) {
		printError(' Не передан номер года. Должно быть число от 2021 до 2029 ')
		return;
	}
	try {
		saveKeyValue([PARAMS.year], [year]);
		printSucces(' Год сохранен')
	} catch (error) {
		printError(error.message)
	}
}

const saveWell = async (well, times, type) => {
	if (!(well + '').length) {
		printError(' Не передан номер скважины')
		return;
	}
	if (times.length < 2) {
		printError('Не передана дата и время начала строительства скважины');
		return;
	}
	try {
		const start = moment(`${times[0]} ${times[1] < 10 ? '0' + times[1] : times[1]}`);
		if (!start.isValid()) {
			printError('Не правильно задана дата начала строительства скважины');
			return;
		}
		let end = moment('3000-01-01');
		if (times.length > 2) {
			end = moment(`${times[2]} ${times[3] < 10 ? '0' + times[3] : times[3]}`);
		}
		if (!end.isValid()) {
			printError('Не правильно задана дата оконания строительства скважины');
			return;
		}
		if (end.isBefore(start)) {
			printError('Время окончания строительства скважины должно быть после времени начала строительства скважины');
			return;
		}

		const year = await getKeyValue(PARAMS.year);
		const month = await getKeyValue(PARAMS.month);
		if (start.isAfter(`${year}-${month < 10 ? '0' + month : month}-${countDaysOfMonth(year, month)} 23:59`) ||
			end.isBefore(`${year}-${month < 10 ? '0' + month : month}-01 00:00`)) {
			printError('Время строительства скважины не происходит в отчетном месяце')
			return;
		}

		const wells = await getKeyValue([PARAMS.wells]);

		wells != [] && wells.forEach(w => {
			if (!(moment(w[PARAMS.wellStart]).isSameOrAfter(end) || moment(w[PARAMS.wellEnd]).isSameOrBefore(start))) {
				throw new Error('Время строительства скважины пересекается с другими скважинами');
			}
		})

		wells.push({
			type: type,
			number: '' + well,
			start: start.format('YYYY-MM-DD HH:mm'),
			end: end.format('YYYY-MM-DD HH:mm')
		})

		await saveKeyValue([PARAMS.wells], [wells]);
		printSucces(` Информаци о строительстве скважины ${well} сохранена`)
	} catch (error) {
		printError(error.message)
	}
}

const clearWells = async () => {
	try {
		await saveKeyValue([PARAMS.wells], [[]]);
		printSucces('Данные о строительстве скважин удалены')
	} catch (error) {
		printError(error.message)
	}
}

const initCli = async () => {
	const args = yargs(process.argv.slice(2)).argv;
	if (args.h) {
		printHelp();
		return;
	}
	if (args.e) {
		printGuide();
		return;
	}
	if (args.v) {
		printData();
		return;
	}
	if (args.c) {
		clearWells()
		return;
	}
	if (args.d) {
		saveTypeNumber(args.d, args._)
		return;
	}
	if (args.f) {
		saveFieldBush(args.f, args._)
		return;
	}
	if (args.m || args.m == 0) {
		saveMonth(args.m)
		return;
	}
	if (args.y || args.y == 0) {
		saveYear(args.y);
		return;
	}
	if (args.w) {
		saveWell(args.w, args._, 'build');
		return;
	}
	if (args.p) {
		saveWell(args.p, args._, 'prepare');
		return;
	}

	await writeReport()
}

initCli()