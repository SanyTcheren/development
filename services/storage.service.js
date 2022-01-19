import { homedir } from 'os'
import { join } from 'path'
import { promises } from 'fs'

const PARAMS = {
	type: "type",
	number: 'number',
	field: 'field',
	bush: 'bush',
	month: 'month',
	year: 'year'
}


const fileData = join(homedir(), 'power-report.json');

const readData = async (filePath) => {
	filePath = filePath ? filePath : fileData;
	let data = {};
	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath);
		data = JSON.parse(file);
	}
	return data;
}

const isExist = async (path) => {
	try {
		await promises.stat(path)
		return true;
	} catch (e) {
		return false;
	}
}

const getKeyValue = async (key) => {
	const data = await readData(fileData);
	return data[key];
}

const saveKeyValue = async (key, value) => {
	let data = await readData(fileData);
	for (let i = 0; i < key.length; i++) {
		data[key[i]] = value[i];
	}
	await promises.writeFile(fileData, JSON.stringify(data));
}

export { readData, saveKeyValue, PARAMS }