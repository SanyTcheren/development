
const cellMerge31 = ['B24:D24', 'B27:D27', 'B30:D30', 'B33:D33', 'B34:D34', 'B36:D36', 'L28:P28', 'L31:P31', 'AH18:AI18'];
const cellUnMerge31 = ['B24', 'B27', 'B30', 'B33', 'B34', 'B36', 'L28', 'L31', 'AH18'];
const cellMerge32 = ['B25:D25', 'B28:D28', 'B31:D31', 'B34:D34', 'B35:D35', 'B37:D37', 'L29:P29', 'L32:P32', 'AH19:AI19', 'B12:D12', 'B15:D15', 'B18:D18', 'A16:A18', 'A13:A15', 'A10:A12'];
const cellUnMerge32 = ['B25', 'B28', 'B31', 'B34', 'B35', 'B37', 'L29', 'L32', 'AH19', 'B12', 'B15', 'B18', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18',];
const cellMerge21 = ['B21:D21', 'B24:D24', 'B27:D27', 'B30:D30', 'B31:D31', 'B33:D33', 'L25:P25', 'L28:P28', 'AH15:AI15'];
const cellUnMerge21 = ['B21', 'B24', 'B27', 'B30', 'B31', 'B33', 'L25', 'L28', 'AH15'];
const cellMerge22 = ['B22:D22', 'B25:D25', 'B28:D28', 'B31:D31', 'B32:D32', 'B34:D34', 'L26:P26', 'L29:P29', 'AH16:AI16', 'A10:A12', 'A13:A15', 'B12:D12', 'B15:D15'];
const cellUnMerge22 = ['B22', 'B25', 'B28', 'B31', 'B32', 'B34', 'L26', 'L29', 'AH16', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'B12', 'B15'];
const cellMerge11 = ['B18:D18', 'B21:D21', 'B24:D24', 'B27:D27', 'B28:D28', 'B30:D30', 'L22:P22', 'L25:P25', 'AH12:AI12'];
const cellUnMerge11 = ['B18', 'B21', 'B24', 'B27', 'B28', 'B30', 'L22', 'L25', 'AH12'];
const cellMerge12 = ['B19:D19', 'B22:D22', 'B25:D25', 'B28:D28', 'B29:D29', 'B31:D31', 'L23:P23', 'L26:P26', 'AH13:AI13', 'A10:A12', 'B12:D12'];
const cellUnMerge12 = ['B19', 'B22', 'B25', 'B28', 'B29', 'B31', 'L23', 'L26', 'AH13', 'A10', 'A11', 'A12', 'B12'];

const TEMPLATE = {
	sabe: undefined,
	sab: {
		wells: 3,
		rowDel: [[18, 3]],
		cellUnMerge: cellUnMerge31,
		cellMerge: cellMerge31,
	},
	sae: {
		wells: 3,
		rowDel: [[15, 3]],
		cellUnMerge: [...cellUnMerge31, 'A15', 'B17'],
		cellMerge: [...cellMerge31, 'A15:A17', 'B17:D17']
	},
	abe: {
		wells: 3,
		rowDel: [[10, 2]],
		cellUnMerge: cellUnMerge32,
		cellMerge: cellMerge32,
	},
	sa: {
		wells: 2,
		rowDel: [[15, 6]],
		cellUnMerge: cellUnMerge21,
		cellMerge: cellMerge21,
	},
	se: {
		wells: 2,
		rowDel: [[12, 6]],
		cellUnMerge: [...cellUnMerge21, 'A12', 'B14'],
		cellMerge: [...cellMerge21, 'A12:A14', 'B14:D14'],
	},
	be: {
		wells: 2,
		rowDel: [[10, 5]],
		cellUnMerge: cellUnMerge22,
		cellMerge: cellMerge22,
	},
	be: {
		wells: 2,
		rowDel: [[18, 3], [10, 2]],
		cellUnMerge: cellUnMerge22,
		cellMerge: cellMerge22,
	},
	s: {
		wells: 1,
		rowDel: [[12, 9]],
		cellUnMerge: cellUnMerge11,
		cellMerge: cellMerge11,
	},
	e: {
		wells: 1,
		rowDel: [[10, 8]],
		cellUnMerge: cellUnMerge12,
		cellMerge: cellMerge12,
	},
	a: {
		wells: 1,
		rowDel: [[15, 6], [10, 2]],
		cellUnMerge: cellUnMerge12,
		cellMerge: cellMerge12,
	}
}

const getTemplate = () => {
	return TEMPLATE.a;
}

export { getTemplate }