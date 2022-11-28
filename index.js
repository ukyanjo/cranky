import "dotenv/config";
import { app } from "./src/app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`서버 연결에 성공했습니다.  http://localhost:${PORT}`);
});
