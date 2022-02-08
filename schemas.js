import Joi from 'joi';
const schemas = {
  user: Joi.object({
    id: Joi.number(),
    name: Joi.string().required(),
    email: Joi.string().email().required()
  })

};

export { schemas }