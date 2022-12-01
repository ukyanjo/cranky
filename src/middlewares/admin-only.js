import jwt from "jsonwebtoken";

const adminOnly = (req, res, next) => {
  const adminToken = req.headers["authorization"]?.split(" ")[1];
  if (!adminToken || adminToken === "null") {
    res.status(401).json({
      result: "failure",
      reason: "토큰을 확인해주시기 바랍니다.",
    });
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const decodedToken = jwt.verify(adminToken, secretKey);
    const role = decodedToken.role;
    if (role !== "admin") {
      res.status(403).json({
        result: "failure",
        reason: "관리자만 접근할 수 있습니다.",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { adminOnly };
