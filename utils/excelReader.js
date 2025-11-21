const fs = require('fs');
const parse = require('csv-parse/sync');
const xlsx = require('xlsx');
const path = require('path');

function readCSV(filePath) {
  const fileContent = fs.readFileSync(filePath);
  return parse.parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
}

function readExcel(filePath, sheetName) {
  const workbook = xlsx.readFile(path.resolve(filePath));
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

module.exports = { readCSV, readExcel };