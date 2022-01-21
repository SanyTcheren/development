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

const printGuide = () => {
	console.log(
		dedent`${chalk.bgYellow.bold.black(' GUIDE ')}
		1. Снимите профиль мощности со стчетчика электрической энергии СЭТ-4М, переименуйте его в ${chalk.yellow('power.txt')} и поместите в домашнюю папку пользователя вашей ОС. Файл должен содержать профиль мощности по часам с 1го по последнее число месяца.
		2. Сконфигурируйте общие данные необходимые для отчета:
		${chalk.blue(`
		node report - y 2021 
		node report - m 11
		node report - d "УРАЛМАШ 5000/320 ЭК-БМЧ" 14938
		node report - f "Тепловское" 108
		`)}
		3. Задайте данные по скважинам:
		${chalk.blue(`
		node report - w 2011Г 2021 - 10 - 10 12 2021 - 11 - 05 10
		node report - p 1903Г 2021 - 11 - 05 10 2021 - 11 - 05 22
		node report - w 1903Г 2021 - 11 - 05 22 2021 - 11 - 25 16
		node report - p 8888Г 2021 - 11 - 25 16 2021 - 11 - 26 02
		node report - w 8888Г 2021 - 11 - 26 02
		`)}
		4. Проверьте введеные данные:
		${chalk.blue(`
		node report - v
		`)}
		- если необходимо изменить общие данные, то просто воспользуйтесь соответствующей командой ещё раз
		- если необходимо изменить данные по скважинам то сначала выполните чистку, а потом повторно введите данные
		${chalk.blue(`
		node report - c
		`)}
		5. Если данные верны, то сгенерируйте отчет
		${chalk.blue(`
		node report
		`)}
		6. Заберите файл отчета ${chalk.yellow('report.xlsx')} из домашней папки пользователя вашей ОС `);
}

export { printError, printSucces, printHelp, printData, printGuide }