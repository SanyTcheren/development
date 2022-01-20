import yargs from "yargs";
import { writeReport } from "./helper/writeReport.js";
import { printData, printHelp, printError, printSucces } from "./services/log.service.js";
import { PARAMS, saveKeyValue } from "./services/storage.service.js";

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

const initCli = async () => {
	const args = yargs(process.argv.slice(2)).argv;
	if (args.h) {
		printHelp();
		return;
	}
	if (args.e) {
		//пример использовния
		return;
	}
	if (args.v) {
		printData();
		return;
	}
	if (args.c) {
		//очистка данных по скважинам
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
		//добавление скважины
		return;
	}
	if (args.p) {
		//добавление пзр
		return;
	}

	await writeReport()
}

initCli()