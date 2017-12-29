const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

// Handle incoming GET request to /orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    // Merge with other models ('model', needed table)
    .populate("product", "name price")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              details: "Getting order by id",
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  //   res.status(200).json({
  //     message: "Orders were fetched"
  //   });
});

router.post("/", (req, res, next) => {
  // Product can't stored if doesn't exist
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders" + result._id
        }
      });
      //   res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });

  //   const order = {
  //     productId: req.body.productId,
  //     quantity: req.body.quantity
  //   };
  //   res.status(201).json({
  //     message: "Order was created",
  //     order: order
  //   });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product", "name price")
    .exec()
    .then(order => {
      if (order) {
        res.status(200).json({
          order: order,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders"
          }
        });
      } else {
        res.status(404).json({
          message: "Order not found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  //   res.status(200).json({
  //     message: "Order details",
  //     orderId: req.params.orderId
  //   });
});

router.delete("/:orderId", (req, res, next) => {
  Order.remove({
    _id: req.params.orderId
  })
    .exec()
    .then(result => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: {
            productId: "ID",
            quantity: "Number"
          }
        }
      });
    })
    .catch(err => {
      res.status(500),
        json({
          error: err
        });
    });
  //   res.status(200).json({
  //     message: "Order deleted",
  //     orderId: req.params.orderId
  //   });
});

module.exports = router;
