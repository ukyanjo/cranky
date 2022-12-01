import jwt from "jsonwebtoken";

function loginRequired(req, res, next) {
  const userToken = req.headers["authorization"]?.split(" ")[1];
  if (!userToken || userToken === "null") {
    res.status(401).json({
      result: "failure",
      reason: "로그인 유저만 사용할 수 있는 서비스입니다.",
    });
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const decodedToken = jwt.verify(userToken, secretKey);
    const userId = decodedToken.userId;
    req.currentUserId = userId;
    req.body.sellerId = userId;
    next();
  } catch (error) {
    res.status(401).json({
      result: "failure",
      reason: "사용 가능한 토큰이 아닙니다.",
    });
  }
}

export { loginRequired };
