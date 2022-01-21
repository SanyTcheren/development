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

const readPower = async (file) => {
	//Создаем массив
	const power = []
	for (let i = 0; i < 31; i++) {
		power.push(new Array(24).fill(0))
	}
	let data = await promises.readFile(file);
	//Декодируем данные и разбиваем на массив по строкам
	data = inconv.decode(data, 'win1251');
	data = data.split('\n');
	//Первые 5 и 1 последняя строка не содержат информации о мощности
	for (let i = 0; i < (data.length - 6) / 24; i++) { // i - соответствует дню
		for (let k = 0; k < 24; k++) {                 // k - соответствует часу
			//Каждую строку разбиваем на массив и выбираем активную энергию
			const p = data[i * 24 + k + 5].split('\t')[2];
			//Пересчитвыаем с учетом формата записи и коэффициента мощности
			power[i][k] = +p.replace(',', '.') * kPower;
		}
	}
	return power;
}
//Возвращаем двумерный массив 31*24 значения - мощность за час
const getPower = async (file) => {
	await isExist(file);
	const power = await readPower(file);
	return power;
}

export { getPower }
