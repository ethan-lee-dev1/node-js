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
app.get(
  "/cars/:id",
  cors(corsOptions),
  param("id").isNumeric(),
  async (req, res) => {
    try {
      //validate
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ erros: errors.array() });
      }
      const carId = req.params.id;

      const [car] = await promisePool.query(
        "select * from car where car_id = ?",
        [carId]
      );
      car[0]
        ? res.send(car[0])
        : res.status(404).send({ message: "Not found." });
    } catch (error) {
      res.status(404).send(error);
    }
  }
);

//get car by make
app.get("/cars", cors(corsOptions), async (req, res) => {
  try {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const make = req.query.make;
    const [car] = await promisePool.query(
      "select * from car where make = ?",
      make
    );
    car ? res.send(car) : res.status(404).send({ message: "Not found." });
  } catch (error) {
    res.status(404);
  }
});

//post car
app.post("/cars/", cors(corsOptions), async (req, res) => {
  try {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const car = req.body;
    console.log(req.body);
    const [result] = await promisePool.execute(
      "insert into car (make, model, color, price) values (?, ?, ?, ?)",
      [car.make, car.model, car.color, car.price]
    );

    const newCarId = result.insertId;
    const [newCar] = await promisePool.query(
      "select * from car where car_id = ?",
      newCarId
    );

    car ? res.send(newCar[0]) : res.status(404).send({ message: "Not found." });
  } catch (error) {
    res.status(404);
  }
});

//put car
app.put(
  "/cars/:id",
  cors(corsOptions),
  param("id").isNumeric(),
  async (req, res) => {
    try {
      //validate
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ erros: errors.array() });
      }

      const carId = req.params.id;
      const newCar = req.body;

      const [result] = await promisePool.execute(
        "update car set make = ?, model = ?, color = ?, price = ? where car_id = ?",
        [newCar.make, newCar.model, newCar.color, newCar.price, carId]
      );
      result
        ? res.send({ "message ": result.info })
        : res.status(404).send({ message: "Not found." });
    } catch (error) {
      res.status(404);
    }
  }
);

//delete car
app.delete(
  "/cars/:id",
  cors(corsOptions),
  param("id").isNumeric(),
  async (req, res) => {
    try {
      //validate
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ erros: errors.array() });
      }

      const carId = req.params.id;
      const [result] = await promisePool.execute(
        "delete from car where car_id = ?",
        [carId]
      );
      result
        ? res.send(result)
        : res.status(404).send({ message: "Not found." });
    } catch (error) {
      res.status(404);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Express web API running on port: ${PORT}.`);
});
