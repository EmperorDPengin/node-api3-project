const moment = require('moment');
const yup = require('yup');

const Users = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  const timeStamp = moment().format('HH:mm:ss');
  console.log(`${req.method} ${req.baseUrl} ${timeStamp}`);
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  Users.getById(req.params.id)
    .then(userById => {
      if (userById) {
        req.user = userById;
        next();
      } else {
        next({ status: 404, message: "user not found"});
      }
    })
    .catch(next);
}

const userSchema = yup.object().shape({
  name: yup
    .string()
    .typeError('Name needs to be a string')
    .trim()
    .required('A name is required')
    .min(3, 'Name must be at least 3 characters long')
    .max(20, 'Name cannot be more than 20 characters in length')
})

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  userSchema.validate(req.body,
    {strict: true,
    stripUnknown: true}
    )
      .then(validated => {
        req.body = validated;
        next();
      })
      .catch(err => {
        next({status: 400, message: "missing required name field"})
      });
}

const postSchema = yup.object().shape({
  text: yup
    .string()
    .trim()
    .required('missing required text field')
});

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  postSchema.validate(req.body,
    {strict: true,
    stripUnknown: true})
      .then(validated => {
        req.body = validated;
        next();
      })
      .catch(err => {
        next({status:400, message: "missing required text field"});
      });
}

function handleError(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    prodMessage: "something went wrong"
  });
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUser,
  validateUserId,
  validatePost,
  handleError
}