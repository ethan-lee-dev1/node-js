const promisePool = require("./PromisePool.js").promisePool;

const SELECT_PERSONS = "select * from person";
const SELECT_PERSON = "select * from person where person_id = ?";
const INSERT_PERSON =
  "insert into person (first_name, last_name) values (?, ?)";
const UPDATE_PERSON =
  "update person set first_name = ?, last_name = ? where person_id = ?";
const DELETE_PERSON = "delete from person where person_id = ?";
//
const SELECT_CAR = "select * from car where car_id = ?";
const SELECT_CAR_BY_MAKE = "select * from car where make = ?";
const UPDATE_CAR =
  "update car set make = ?, model = ?, color = ?, price = ? where car_id = ?";
const INSERT_CAR =
  "insert into car (make, model, color, price) values (?, ?, ?, ?)";
const DELETE_CAR = "delete from car where car_id = ?";

exports.selectPersons = async () => {
  try {
    const [rows] = await promisePool.query(SELECT_PERSONS);
    return rows;
  } catch (e) {
    console.log(e);
  }
};

exports.selectCarById = async (carId) => {
  try {
    const [rows] = await promisePool.query(SELECT_CAR, [carId]);
    return rows[0];
  } catch (e) {
    console.log(e);
  }
};
