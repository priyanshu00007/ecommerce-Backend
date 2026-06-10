const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ message: 'Validation error', errors: messages });
  }
  next();
};

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  category: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(1000).allow('', null),
  }),
  product: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(5000).allow('', null),
    price: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().min(0).required(),
    category_id: Joi.number().integer().allow(null),
    image_url: Joi.string().uri().max(500).allow('', null),
  }),
  cartItem: Joi.object({
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).max(100).default(1),
  }),
  cartUpdate: Joi.object({
    quantity: Joi.number().integer().min(1).max(100).required(),
  }),
  wishlistItem: Joi.object({
    product_id: Joi.number().integer().required(),
  }),
  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(2000).allow('', null),
  }),
  payment: Joi.object({
    order_id: Joi.number().integer().required(),
    method: Joi.string().valid('card', 'upi', 'cod', 'net_banking').required(),
  }),
  orderStatus: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').required(),
  }),
};

module.exports = { validate, schemas };
