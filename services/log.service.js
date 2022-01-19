import chalk from 'chalk'
import dedent from 'dedent-js'
import { readData } from './storage.service.js';

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
		${chalk.yellow('-p [number] [s-date] [s-hours] [f-date] [f-hours]')} - добавление в отчет пзр скважины`);
}

const printData = async () => {
	try {
		const data = await readData();
		console.log(
			dedent`${chalk.bgYellow.bold.black(' VIEW ')}
				Проверьте данные для формирования отчета ->
				Отчетный год: ${chalk.red(data.year)}
				Отчетный месяц: ${chalk.red(data.month)}
				Месторождение: ${chalk.red(data.field)}
				Номер куста: ${chalk.red(data.bush)}
				Тип буровой установки: ${chalk.red(data.type)}
				Номер буровой установки: ${chalk.red(data.number)}
				${chalk.blue('Скважины:')} 
				ПЗР: ${printArr(data.pzr)}
				Бурение: ${printArr(data.wells)}
			`);
	} catch (error) {
		printError(error.message)
	}
}

const printArr = (arr) => {
	if (!arr || arr.length == 0) return;
	let result = ``
	for (let i = 0; i < arr.length; i++) {
		result += `\n\t\еномер: ${chalk.red(arr[i].number)}, начало: ${chalk.red(arr[i].start)}, окончание:${chalk.red(arr[i].end)}`;
	}
	return result;
}

export { printError, printSucces, printHelp, printData }