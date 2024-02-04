const role = function (req, res, next) {
  if (req.body.createdBy.role === "assistant")
    return res.status(403).send("Access Denied");
  next();
};

module.exports = role;
