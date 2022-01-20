import chalk from 'chalk'
import dedent from 'dedent-js'
import { readData } from './storage.service.js';
import { PARAMS } from './storage.service.js';

const printError = error => {
	console.log(chalk.bgRed(' ERROR ') + error);
}

const printSucces = message => {
	console.log(chalk.bgYellow.bold.black(' SUCCESS ') + message)
}

const printHelp = () => {
	console.log(
		dedent`${chalk.bgYellow.bold.black(' HELP ')}
		${chalk.yellow('без параметров')} - создание отчета на основе установленных данных
		${chalk.yellow('-h')} - вывод справки
		${chalk.yellow('-e')} - показывает пример использования cli
		${chalk.yellow('-v')} - показывает установленные данные для отчета
		${chalk.yellow('-c')} - очищает данные по скважинам
		${chalk.yellow('-d [type] [number]')} - установка типа(${chalk.red('название БУ пишите в кавычках')}) и номера буровой установки
		${chalk.yellow('-f [field] [bush]')} - установка месторождения(${chalk.red('если из нескольких слов пишите в кавычках')}) и номера куста
		${chalk.yellow('-m [month]')} - установка номера отчетного месяца(${chalk.red('указывайте в цифрах 1-12')})
		${chalk.yellow('-y [year]')} - установка отчетного года
		${chalk.yellow('-w [number] [s-date] [s-hours] [f-date] [f-hours]')} - добавление в отчет скважины 
		${chalk.yellow('-p [number] [s-date] [s-hours] [f-date] [f-hours]')} - добавление в отчет пзр скважины
		${chalk.red('дату указывайте по шаблону YYYY-MM-DD, для времени укажите час обычным числом')}`);
}

const printData = async () => {
	try {
		const data = await readData();
		console.log(
			dedent`${chalk.bgYellow.bold.black(' VIEW ')}
				Проверьте данные для формирования отчета ->
				Отчетный год:\t ${chalk.red(data[PARAMS.year])}
				Отчетный месяц:\t ${chalk.red(data[PARAMS.month])}
				Месторождение:\t ${chalk.red(data[PARAMS.field])}
				Номер куста:\t ${chalk.red(data[PARAMS.bush])}
				Тип буровой установки:   ${chalk.red(data[PARAMS.type])}
				Номер буровой установки: ${chalk.red(data[PARAMS.number])}
				${chalk.blue('Скважины:')}${printArr(data[PARAMS.wells])}
			`);
	} catch (error) {
		printError(error.message)
	}
}

const printArr = (arr) => {
	if (!arr || arr.length == 0) return;
	let result = ``
	for (let i = 0; i < arr.length; i++) {
		result += `\n\t ${arr[i][PARAMS.wellType] == 'build' ? 'Бурение:' : 'ПЗР:\t'} \tномер скважины: ${chalk.red(arr[i][PARAMS.wellNumber])} \tначало: ${chalk.red(arr[i][PARAMS.wellStart])} \tокончание:${chalk.red(arr[i][PARAMS.wellEnd])}`;
	}
	return result;
}

export { printError, printSucces, printHelp, printData }