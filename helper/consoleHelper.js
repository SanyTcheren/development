import { CELLS, writeCell } from './excelHelper.js'
import dedent from 'dedent-js'
import chalk from 'chalk'
import readline from 'readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const greating = () => {
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
		Месяц отчета: `,
			month => {
				writeCell(CELLS.month, month);
				resolve();
			})
	})
}



export { greating, goodbuy, setMonth }