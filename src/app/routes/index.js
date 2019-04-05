const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
let routes = [];
const filterFile = file => {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
};

const d = fs.readdirSync(__dirname).filter(filterFile);
d.forEach(file => {
  try {
    let m = require(`./${file.split('.js')[0]}`);
    routes.push(m);
  } catch (e) {
    console.log('Error', e);
  }
});
module.exports = routes;
