const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/get/barchart", [authJwt.verifyToken], controller.getBarChartData);
  app.post("/api/get/linechart", [authJwt.verifyToken], controller.getLineChartData);
};