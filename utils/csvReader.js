const xlsx = require('xlsx');
const path = require('path');

function readExcel(filePath, sheetName) {
  const workbook = xlsx.readFile(path.resolve(filePath));
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

module.exports = { readExcel };