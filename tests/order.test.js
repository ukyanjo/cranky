import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../src/app";

describe("order 관련 테스트", () => {
  // 임시 랜덤 문자열 제작용
  const random = Math.random().toString(36).substring(2, 7);

  // 각 테스트에서 공통으로 사용할 변수
  let token;
  let orderId;
  const address = {
    postalCode: "12345",
    address1: "서울시 oo로 00빌딩",
    address2: "3층 991호",
    receiverName: "튜터",
    receiverPhoneNumber: "01012345678",
  };

  const address2 = {
    postalCode: "54321",
    address1: "서울시 oo로 00빌딩2",
    address2: "3층 1111호",
    receiverName: "튜터2",
    receiverPhoneNumber: "01084911111111",
  };

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/register")
      .set("Content-Type", "application/json")
      .send({
        fullName: "tester",
        email: `${random}@example.com`,
        password: "1234",
      });

    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    token = jwt.sign({ userId: res.body._id, role: "admin" }, secretKey);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("post -> /api/order", () => {
    it("주문 db에 주문 정보가 추가된다.", async () => {
      const res = await request(app)
        .post("/api/order")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          summaryTitle: "봄, 가을 니트 / 1개",
          totalPrice: 13000,
          address,
          request: "경비실에 맡겨 주세요.",
        });

      // 다른 테스트에 쓰일 주문 id
      orderId = res.body._id;

      expect(res.statusCode).toEqual(201);
      expect(orderId).toBeDefined();
      expect(res.body.totalPrice).toBe(13000);
      expect(res.body.address).toEqual(address);
      expect(res.body.request).toMatch(/경비실/);
    });
  });

  describe("get -> /api/orderlist/all", () => {
    it("최소 3개의 주문 리스트 배열을 반환한다.", async () => {
      await request(app)
        .post("/api/order")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          summaryTitle: "봄, 가을 니트 / 1개",
          totalPrice: 13000,
          address,
          request: "경비실에 맡겨 주세요.",
        });

      await request(app)
        .post("/api/order")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          summaryTitle: "봄, 가을 니트 / 1개",
          totalPrice: 13000,
          address,
          request: "경비실에 맡겨 주세요.",
        });

      await request(app)
        .post("/api/order")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          summaryTitle: "봄, 가을 니트 / 1개",
          totalPrice: 13000,
          address,
          request: "경비실에 맡겨 주세요.",
        });

      const res = await request(app)
        .get("/api/orderlist/all")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("get -> /api/orderlist/user", () => {
    it("최소 3개의 주문 리스트 배열을 반환한다.", async () => {
      const res = await request(app)
        .get("/api/orderlist/user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("get -> /api/orders/:orderId", () => {
    it("주문 정보를 반환한다.", async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.totalPrice).toBe(13000);
      expect(res.body.address).toEqual(address);
      expect(res.body.request).toMatch(/경비실/);
    });
  });

  describe("patch -> /api/orders/:orderId", () => {
    it("주문 정보의 수정이 정상적으로 이루어진다.", async () => {
      const res = await request(app)
        .patch(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          address: address2,
          request: "직접 가지러 가겠습니다.",
          status: "pending222",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.address).toEqual(address2);
      expect(res.body.request).toMatch(/직접/);
      expect(res.body.status).toBe("pending222");
    });
  });

  describe("delete -> /api/orders/:orderId", () => {
    it("주문 정보의 삭제가 정상적으로 이루어진다.", async () => {
      const res = await request(app)
        .delete(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.result).toBe("success");
    });
  });
});
