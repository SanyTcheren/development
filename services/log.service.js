import chalk from 'chalk'
import dedent from 'dedent-js'
import { getPower } from '../helper/getPower.js';
import { powerPath } from '../helper/writeReport.js';
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
		${chalk.yellow(`--all`)} - выводит потребленную электроэнергию по дням за весь отчетный месяц
		${chalk.yellow(`--day [day] [h1] [h2] ...`)} - выводит потребленную энергию за день,
		при задании ${chalk.yellow('h1, ...')} разобъет суммирование энергию по часам, 
		значение ${chalk.yellow('h1, ...')} число от 1 до 23
		${chalk.yellow('-h')} - вывод справки
		${chalk.yellow('-e')} - показывает пример использования cli
		${chalk.yellow('-v')} - показывает установленные данные для отчета
		${chalk.yellow('-c')} - очищает данные по скважинам
		${chalk.yellow('-d [type] [number]')} - установка типа(${chalk.red('название БУ пишите в кавычках')}) и номер буровой установки
		${chalk.yellow('-f [field] [bush]')} - установка месторождения(${chalk.red('если из нескольких слов пишите в кавычках')}) и номера куста
		${chalk.yellow('-m [month]')} - установка номера отчетного месяца(${chalk.red('указывайте в цифрах 1-12')})
		${chalk.yellow('-y [year]')} - установка отчетного года
		${chalk.yellow('-w [number] [s-date] [s-hours] [f-date] [f-hours]')} - добавление в отчет скважины 
		${chalk.yellow('-p [number] [s-date] [s-hours] [f-date] [f-hours]')} - добавление в отчет пзр скважины
		${chalk.red('дату указывайте по шаблону YYYY-MM-DD, для времени укажите час обычным числом')}
		${chalk.yellow('-o')} - создание отчета на основе установленных данных
		`);

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
		1. Снимите профиль мощности со счетчика электрической энергии СЭТ-4М,
		переименуйте его в ${chalk.yellow('power.txt')} и поместите в домашнюю папку пользователя вашей ОС. 
		Файл должен содержать профиль мощности по часам с 1го по последнее число месяца.
		2. Проверьте введенные данные
		${chalk.blue(`
		node report --all
		`)}
		3.При необходимости проверьте данные за определенный день
		${chalk.blue(`
		node report --day 12 10 18
		`)}
		4. Сконфигурируйте общие данные необходимые для отчета:
		${chalk.blue(`
		node report -y 2021 
		node report -m 11
		node report -d "УРАЛМАШ 5000/320 ЭК-БМЧ" 14938
		node report -f "Тепловское" 108
		`)}
		5. Задайте данные по скважинам:
		${chalk.blue(`
		node report -w 2011Г 2021 - 10 - 10 12 2021 - 11 - 05 10
		node report -p 1903Г 2021 - 11 - 05 10 2021 - 11 - 05 22
		node report -w 1903Г 2021 - 11 - 05 22 2021 - 11 - 25 16
		node report -p 8888Г 2021 - 11 - 25 16 2021 - 11 - 26 02
		node report -w 8888Г 2021 - 11 - 26 02
		`)}
		6. Проверьте введеные данные:
		${chalk.blue(`
		node report -v
		`)}
		- если необходимо изменить общие данные, то просто воспользуйтесь соответствующей командой ещё раз
		- если необходимо изменить данные по скважинам то сначала выполните чистку, а потом повторно введите данные
		${chalk.blue(`
		node report -c
		`)}
		7. Если данные верны, то сгенерируйте отчет
		${chalk.blue(`
		node report -o
		`)}
		8. Заберите файл отчета ${chalk.yellow('report.xlsx')} из домашней папки пользователя вашей ОС `);
}

const printAll = async () => {
	try {
		const data = await getPower(powerPath);
		console.log(dedent`${chalk.bgYellow.bold.black(' MONTH ')}
		День:   Энергия:`)
		for (let i = 0; i < data.length; i++) {
			const bgColor = i % 2 == 0 ? 'bgGrey' : 'bgBlack';
			const color = i % 2 == 0 ? 'black' : 'white';
			console.log(chalk[bgColor][color](`${i < 9 ? '0' + (i + 1) : (i + 1)}      ${Math.round(data[i].reduce((p, d) => p + d))}`))
		}
	} catch (error) {
		printError(error.message)
	}
}

const printDay = async (day, hours) => {
	try {
		if (!(+('' + day)) || !(+day > 0 && +day < 32)) {
			throw new Error(' Задайте день числом от 1 до 31')
		}
		for (let i = 0; i < hours.length; i++) {
			if (!(+('' + hours[i])) || !(+hours[i] > 0 && +hours[i] < 24)) {
				throw new Error(' Задайте разделительные часы числом от 1 до 23')
			}
		}
		const data = (await getPower(powerPath))[day - 1];
		console.log(dedent`${chalk.bgYellow.bold.black(` DAY ${day} `)}
		Начало:\tКонец:\tЭнергия:`)
		for (let i = -1; i < hours.length; i++) {
			// do {
			const bgColor = i % 2 != 0 ? 'bgGrey' : 'bgBlack';
			const color = i % 2 != 0 ? 'black' : 'white';
			let start = hours[i] ? hours[i] : '0';
			let end = hours[i + 1] ? hours[i + 1] : 24
			console.log(chalk[bgColor][color](`${start < 10 ? '0' + start : start}:00   ${end < 10 ? '0' + end : end}:00   ${Math.round(data.slice(start, end).reduce((p, d) => p + d))}`))
		}
	} catch (error) {
		printError(error.message)
	}
}

export { printError, printSucces, printHelp, printData, printGuide, printAll, printDay }