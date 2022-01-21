import { promises } from 'fs'
import inconv from 'iconv-lite'

const kPower = 7200; //Коэффициент трансформации

const isExist = async (path) => {
	try {
		await promises.stat(path)
	} catch (e) {
		throw new Error(`В рабочей папке отсутствует файл с профилем мощности - power.txt`);
	}
}

const getTemplPower = () => {
	const power = [];
	for (let i = 0; i < 31; i++) {
		const dayPower = new Array(24).fill(0);
		power.push(dayPower);
	}
	return power;
}

const readPower = async (file) => {
	const power = getTemplPower();
	let data = await promises.readFile(file);
	data = inconv.decode(data, 'win1251');
	data = data.split('\n');
	for (let i = 0; i < (data.length - 6) / 24; i++) {
		for (let k = 0; k < 24; k++) {
			const p = data[i * 24 + k + 5].split('\t')[2];
			power[i][k] = +p.replace(',', '.') * kPower;
		}
	}
	return power;
}

const getPower = async (file) => {
	await isExist(file);
	const power = await readPower(file);
	return power;
}

export { getPower }
