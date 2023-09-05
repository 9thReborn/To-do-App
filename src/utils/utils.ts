import Joi from "joi";

export const registerUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  firstName: Joi.string().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("confirm password").messages({"any.only": "{{#label}} does not match"})
});

export const loginUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export const createTodoSchema = Joi.object().keys({
  description: Joi.string().required().trim().lowercase(),
  completed: Joi.boolean().required()
})

export const updateTodoSchema = Joi.object().keys({
  completed: Joi.boolean()
})


export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
