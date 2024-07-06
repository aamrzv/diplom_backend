const express = require("express");
const { selectPrices } = require("../database/queries/select_prices");
const { selectDimension } = require("../database/queries/select_dimension");

const router = express.Router({ mergeParams: true });

router.get("/get", async (req, res) => {
  try {
    const dimension = req.query.dimension;
    const dimensions = await selectDimension(dimension);
    res.status(200).json(dimensions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get_prices", async (req, res) => {
  try {
    const {
      car_group_id,
      wheel_size_id,
      wheel_type_id,
      service_id,
      price_group_id,
    } = req.query;
    const prices = await selectPrices(
      car_group_id,
      wheel_size_id,
      wheel_type_id,
      service_id,
      price_group_id
    );
    res.status(200).json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
