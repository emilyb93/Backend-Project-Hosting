const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  // console.log("run seed")
  return seed(devData).then((results) =>{
  // console.log(results);
   db.end()}
   );
};

runSeed();
