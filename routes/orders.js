const express = require("express");
const { insertOrder } = require("../database/queries/insert_order");
const {
  selectOrderGroupList,
} = require("../database/queries/select_order_group_list");
const { selectOrderList } = require("../database/queries/select_order_list");
const { selectOrder } = require("../database/queries/select_order");
const { selectUserIdBySessionKey } = require("../controllers/auth");
const { deleteOrder } = require("../database/queries/delete_order");
const { updateOrder } = require("../database/queries/update_order");
const { authorize } = require("../middlewares/authorize"); // Подключите middleware

const router = express.Router({ mergeParams: true });

router.post("/insert_order", authorize([1, 2]), async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      throw new Error("No JSON data provided");
    }

    if (!data.carId) {
      throw new Error(`Отсутствует необходимое поле: carId`);
    }
    const requiredFields = ["priceId", "amount"];
    data.detail.forEach((item) => {
      requiredFields.forEach((field) => {
        if (!item[field]) {
          throw new Error(
            `Missing required field: ${field} in item ${JSON.stringify(item)}`
          );
        }
      });
    });
    const sessionKey = req.headers["authorization"];
    const [userId, userRoleId, error] = await selectUserIdBySessionKey(
      sessionKey
    );
    const newOrder = await insertOrder(data, userId);
    res.status(201).json({
      orderId: newOrder.orderInsert,
      contractorId: newOrder.contractorId,
      message: "Order inserted successfully",
    });
  } catch (error) {
    res
      .status(error.message.includes("Missing") ? 400 : 500)
      .json({ error: error.message });
  }
});

router.get("/get_orders_group_list", authorize([1, 2]), async (req, res) => {
  try {
    const orderGroups = await selectOrderGroupList();
    res.status(200).json(orderGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/get_orders_list", authorize([1, 2]), async (req, res) => {
  try {
    const { contractorId, offset } = req.body;
    const orders = await selectOrderList(contractorId, 10, offset);
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(error.message.includes("Missing") ? 400 : 500)
      .json({ error: error.message });
  }
});

router.get("/get_order_detail", authorize([1, 2]), async (req, res) => {
  try {
    const order_id = req.query.order_id;
    const order = await selectOrder(order_id);
    res.status(200).json(order);
  } catch (error) {
    res
      .status(error.message.includes("Missing") ? 400 : 500)
      .json({ error: error.message });
  }
});

router.delete("/delete_order", authorize([1, 2]), async (req, res) => {
  try {
    const order_id = req.query.order_id;
    const order = await deleteOrder(order_id);
    res.status(200).json(order);
  } catch (error) {
    res
      .status(error.message.includes("Missing") ? 400 : 500)
      .json({ error: error.message });
  }
});

router.put("/update_order", authorize([1, 2]), async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      throw new Error("No JSON data provided");
    }
    const requiredFields = ["priceId", "amount"];
    data.detail.forEach((item) => {
      requiredFields.forEach((field) => {
        if (!item[field]) {
          throw new Error(
            `Missing required field: ${field} in item ${JSON.stringify(item)}`
          );
        }
      });
    });
    const sessionKey = req.headers["authorization"];
    const [userId, userRoleId, error] = await selectUserIdBySessionKey(
      sessionKey
    );
    const editOrder = await updateOrder(data, userId);
    res.status(201).json(editOrder);
  } catch (error) {
    res
      .status(error.message.includes("Missing") ? 400 : 500)
      .json({ error: error.message });
  }
});

module.exports = router;
