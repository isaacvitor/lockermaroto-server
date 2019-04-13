const mongooseErrorSanitize = errorMongooseObject => {
  const { errors } = errorMongooseObject;
  const errorsObject = {};
  const errorsArray = [];
  Object.keys(errors).forEach(e => {
    const { message, kind, path } = errors[e];
    errorsObject[e] = { message, kind, path };
    errorsArray.push({ message, kind, path });
  });

  return { errorsObject, errorsArray };
};

const mongooseMidllewareHandle = (err, req, res, next) => {
  console.log('mongooseMidllewareHandle', err.name);
  if (err.errors) {
    const error = mongooseErrorSanitize(err);
    res.status(400).send(error);
  } else if (err.name === 'MongoError') {
    res
      .status(400)
      .send({ errorsArray: [{ message: err.errmsg, kind: 'ValidationError', path: '1' }] });
  } else {
    next();
  }
};

module.exports = mongooseMidllewareHandle;
