import fs from "fs";

const errorLogger = (err, req, res, next) => {
  const current_datetime = new Date();
  const dateFormatted =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  const method = req.method;
  const url = req.url;
  const errorContent = err.stack;
  const errorLog = `[${dateFormatted}] ${method}:${url}\n${errorContent}\n\n`;
  fs.appendFile("error.log", errorLog, (err) => {
    if (err) {
      throw new Error("에러 로깅에 실패했습니다.");
    }
  });

  next(err);
};

export { errorLogger };
