import { CELLS, writeCell, FILES } from './excelHelper.js'
import dedent from 'dedent-js'
import chalk from 'chalk'
import readline from 'readline';
import fs from 'fs/promises'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let defPar = undefined;

const greating = async () => {
	defPar = JSON.parse(await fs.readFile(FILES.default));
	console.log(dedent`${chalk.bgGreen.bold.magenta(' GREATING ')}
		Этот командный интерфейс позволит вам создать отчет по расходу электрической энергии в формате Excel,
		основываясь на профиле мощности, снятого со счетчика электрической энергии СЭТ4М и данных,
		которые Вы введете в командной строке
	`);
}

const goodbuy = () => {
	rl.close();
	console.log(dedent`${chalk.bgGreen.bold.magenta(' GOODBUY ')}
	Рад был помочь,
	До следующего месяца! 
`)
}

const setMonth = async () => {
	return new Promise((resolve, reject) => {
		rl.question(dedent`${chalk.bold.bgGreen.magenta(' MONTH ')}
		Месяц отчета(${defPar.month}): `,
			month => {
				writeCell(CELLS.month, (month ? month : defPar.month));
				resolve();
			})
	})
}

const setDrillingRig = async () => {
	return new Promise((resolve, reject) => {
		rl.question(dedent`${chalk.bold.bgGreen.magenta(' DRILLING_RIG ')}
		Тип буровой установки(${defPar.type}): `,
			type => {
				rl.question(dedent`
				Номер буровой установки(${defPar.number}): `,
					number => {
						writeCell(CELLS.drillingRig,
							`${type ? type : defPar.type} зав.№${number ? number : defPar.number}`);
						resolve();
					})
			})
	})
}




export { greating, goodbuy, setMonth, setDrillingRig }