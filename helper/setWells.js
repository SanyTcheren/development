

const setWells = async (sheet, wells) => {

	sheet.getCell(`A10`).value = wells[0].build.number;
	if (wells[0].prepare) {
		sheet.getCell(`C10`).value = wells[0].prepare.start;
		sheet.getCell(`D10`).value = wells[0].prepare.end;
		sheet.getCell(`C11`).value = wells[0].build.start;
		sheet.getCell(`D11`).value = wells[0].build.end;
	} else {
		sheet.getCell(`C10`).value = wells[0].build.start;
		sheet.getCell(`D10`).value = wells[0].build.end;
	}

	for (let i = 1; i < wells.length; i++) {
		sheet.getCell(`A${12 + 3 * (i - 1)}`).value = wells[0].build.number;
		sheet.getCell(`C${12 + 3 * (i - 1)}`).value = wells[i].prepare.start;
		sheet.getCell(`D${12 + 3 * (i - 1)}`).value = wells[i].prepare.end;
		sheet.getCell(`C${13 + 3 * (i - 1)}`).value = wells[i].build.start;
		sheet.getCell(`D${13 + 3 * (i - 1)}`).value =
			/^3000.*/.test(wells[i].build.end) ? 'переход' : wells[i].build.end;
	}
}

export { setWells }