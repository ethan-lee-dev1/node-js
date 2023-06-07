const cors = require("cors");
const express = require("express");
const promisePool = require("./PromisePool.js").promisePool;
const { body, check, param, validationResult } = require("express-validator");

const PORT = 80;
const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

// Middleware...
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your endpoints here..
app.get("/message", cors(corsOptions), async (req, res) => {
  res.send({ message: "Hello World!!!" });
});

//get car by id
app.get("/cars/:id", cors(corsOptions), async (req, res) => {
  try {
    const carId = req.params.id;

    const [car] = await promisePool.query(
      "select * from car where car_id = ?",
      [carId]
    );
    res.send(car[0]);
  } catch (error) {
    console.log(error);
  }
});

//get car by make
app.get("/cars", cors(corsOptions), async (req, res) => {
  try {
  const make = req.query.make;
  const [car] = await promisePool.query(
    "select * from car where make = ?",
    make
  );
  res.send(car);
  } catch(error){
    res.status(404);
  }
});

//post car
app.post("/cars/", cors(corsOptions), async (req, res) => {
  try {
  const [result] = await promisePool.execute(
    "insert into car (make, model, color, price) values (?, ?, ?, ?)",
    ["Toyota", "Corolla", "Gray", 30000]
  );

  const newCarId = result.insertId;
  const [newCar] = await promisePool.query(
    "select * from car where car_id = ?",
    newCarId
  );

  res.send(newCar[0]);
  } catch(error){
    res.status(404);
  }
});

//put car
app.put("/cars/:id", cors(corsOptions), async (req, res) => {
  try {
  const carId = req.params.id;
  const [result] = await promisePool.execute(
    "update car set make = ?, model = ?, color = ?, price = ? where car_id = ?",
    ["Mazda", "Mazda6", "silver", 30000, carId]
  );
  res.send({ "message ": result.info });
  } catch(error) {
    res.status(404);
  }
});

//delete car
app.delete("/cars/:id", cors(corsOptions), async (req, res) => {
  try {
  const carId = req.params.id;
  const [result] = await promisePool.execute(
    "delete from car where car_id = ?",
    [carId]
  );
  res.send(result);
  } catch(error){
    res.status(404);
  }
});

app.listen(PORT, () => {
  console.log(`Express web API running on port: ${PORT}.`);
});
