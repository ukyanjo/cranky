import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../src/app";

describe("order-item 관련 테스트", () => {
  // 임시 랜덤 문자열 제작용
  const random = Math.random().toString(36).substring(2, 7);

  // 각 테스트에서 공통으로 사용할 변수
  let token;
  let productId;
  let orderId;
  let orderItemId;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/register")
      .set("Content-Type", "application/json")
      .send({
        fullName: "tester",
        email: `${random}@example.com`,
        password: "1234",
      });

    const userId = res.body._id;
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    token = jwt.sign({ userId, role: "admin" }, secretKey);

    const res2 = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        title: `${random}-category`,
        description: "테스트 카테고리입니다.",
        themeClass: "is-primary is-light",
        imageKey: "test-category/test.png",
      });

    const categoryId = res2.body._id;

    const res3 = await request(app)
      .post("/api/product")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        title: `${random}-product`,
        categoryId,
        manufacturer: "삼성",
        shortDescription: "테스트 제품입니다.",
        detailDescription: "테스트 제품의 자세한 설명입니다.",
        imageKey: "test-product/test.png",
        inventory: 100,
        price: 20000,
        searchKeywords: ["한국", "남자옷"],
      });

    productId = res3.body._id;

    const res4 = await request(app)
      .post("/api/order")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        summaryTitle: "테스트 제품 / 1개",
        totalPrice: 13000,
        address: {},
        request: "경비실에 맡겨 주세요.",
      });

    // 다른 테스트에 쓰일 주문 id
    orderId = res4.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("post -> /api/orderitem", () => {
    it("주문아이템 db에 주문아이템 정보가 추가된다.", async () => {
      const res = await request(app)
        .post("/api/orderitem")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          orderId,
          productId,
          quantity: 2,
          totalPrice: 40000,
        });

      // 다른 테스트에 쓰일 주문아이템 id
      orderItemId = res.body._id;

      expect(res.statusCode).toEqual(201);
      expect(orderItemId).toBeDefined();
      expect(res.body.orderId).toBe(orderId);
      expect(res.body.quantity).toBe(2);
      expect(res.body.totalPrice).toBe(40000);
    });
  });

  describe("get -> /api/orderitemlist/all", () => {
    it("(all) 최소 3개의 주문아이템 리스트 배열을 반환한다.", async () => {
      await request(app)
        .post("/api/orderitem")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          orderId,
          productId,
          quantity: 2,
          totalPrice: 40000,
        });

      await request(app)
        .post("/api/orderitem")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          orderId,
          productId,
          quantity: 2,
          totalPrice: 40000,
        });

      await request(app)
        .post("/api/orderitem")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          orderId,
          productId,
          quantity: 2,
          totalPrice: 40000,
        });

      const res = await request(app)
        .get("/api/orderitemlist/all")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("get -> /api/orderitemlist/order/:orderId", () => {
    it("(orderId) 최소 3개의 주문아이템 리스트 배열을 반환한다.", async () => {
      const res = await request(app)
        .get(`/api/orderitemlist/order/${orderId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("get -> /api/orderitemlist/product/:productId", () => {
    it("(productId) 최소 3개의 주문아이템 리스트 배열을 반환한다.", async () => {
      const res = await request(app)
        .get(`/api/orderitemlist/product/${productId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("get -> /api/orderitems/:orderItemId", () => {
    it("주문아이템 정보를 반환한다.", async () => {
      const res = await request(app)
        .get(`/api/orderitems/${orderItemId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.orderId).toBe(orderId);
      expect(res.body.quantity).toBe(2);
      expect(res.body.totalPrice).toBe(40000);
    });
  });

  describe("patch -> /api/orderitems/:orderItemId", () => {
    it("주문아이템 정보의 수정이 정상적으로 이루어진다.", async () => {
      const res = await request(app)
        .patch(`/api/orderitems/${orderItemId}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          quantity: 100,
          totalPrice: 8888,
          status: "complete",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.quantity).toBe(100);
      expect(res.body.totalPrice).toBe(8888);
      expect(res.body.status).toBe("complete");
    });
  });

  describe("delete -> /api/orderitems/:orderItemId", () => {
    it("주문아이템 정보의 삭제가 정상적으로 이루어진다.", async () => {
      const res = await request(app)
        .delete(`/api/orderitems/${orderItemId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.result).toBe("success");
    });
  });
});
