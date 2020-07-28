import * as Joi from "@hapi/joi";

export const createUserDTO: Joi.ObjectSchema = Joi.object({
  email: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});
