import { homedir } from 'os'
import { join } from 'path'
import { promises } from 'fs'
import moment from "moment";


const PARAMS = {
	type: "type",
	number: 'number',
	field: 'field',
	bush: 'bush',
	month: 'month',
	year: 'year',
	wells: 'wells',
	wellType: 'type',
	wellNumber: 'number',
	wellStart: 'start',
	wellEnd: 'end'
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

const getSortedWells = async () => {
	const wellsData = await getKeyValue(PARAMS.wells);
	if (wellsData.length == 0) return [];

	const wells = {};
	for (let i = 0; i < wellsData.length; i++) {
		const name = wellsData[i][PARAMS.wellNumber];
		const well = wells[name] ?? {};
		well[wellsData[i][PARAMS.wellType]] = wellsData[i];
		wells[name] = well;
	}
	const sortedWells = Object.values(wells).sort((a, b) => {
		const aStart = moment(a.prepare ? a.prepare.start : a.build.start);
		const bStart = moment(b.prepare ? b.prepare.start : b.build.start);
		return aStart.isAfter(bStart) ? 1 : -1;
	});
	return sortedWells;
}

export { readData, saveKeyValue, PARAMS, getKeyValue, getSortedWells }