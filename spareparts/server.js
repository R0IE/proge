
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

let data = [];


const loadData = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('LE.txt')
      .pipe(csv({
        headers: [
          'id', 'description', 'field1', 'field2', 'field3', 'field4', 'field5', 
          'field6', 'price', 'make', 'field9'
        ],
        separator: '\t',
        mapValues: ({ header, index, value }) => header === 'price' ? parseFloat(value.replace(',', '.')) : value
      }))
      .on('data', (row) => results.push(row))
      .on('end', () => {
        data = results;
        resolve();
      })
      .on('error', (err) => reject(err));
  });
};


app.use(async (req, res, next) => {
  if (!data.length) {
    await loadData();
  }
  next();
});


const paginate = (array, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return array.slice(start, start + pageSize);
};


app.get('/spare-parts', (req, res) => {
  const { page = 1, pageSize = 10, name, sn } = req.query;

  let result = data;

  if (name) {
    const nameLower = name.toLowerCase();
    result = result.filter(item => item.description.toLowerCase().includes(nameLower));
  }

  if (sn) {
    result = result.filter(item => item.id === sn);
  }

  const total = result.length;
  const paginatedResult = paginate(result, parseInt(page), parseInt(pageSize));

  if (!paginatedResult.length) {
    return res.status(404).json({ error: 'No parts match the search criteria' });
  }

  res.json({
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    total,
    results: paginatedResult
  });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});