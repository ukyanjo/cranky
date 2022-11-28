const errorHandler = (err, req, res, next) => {
  res.status(400).json({ result: "error", reason: err.message });
};

export { errorHandler };
