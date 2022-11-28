import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../src/app";

describe("product 관련 테스트", () => {
  // 임시 랜덤 문자열 제작용
  const random = Math.random().toString(36).substring(2, 7);

  // 각 테스트에서 공통으로 사용할 변수
  let token;
  let sellerId;
  let categoryId;
  let categoryTitle;
  let productId;

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

    sellerId = res.body._id;
    token = jwt.sign({ userId: sellerId, role: "admin" }, secretKey);

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

    categoryId = res2.body._id;
    categoryTitle = res2.body.title;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("post -> /api/product", () => {
    it("제품 db에 제품 정보가 추가된다.", async () => {
      const res = await request(app)
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

      // 다른 테스트에 쓰일 제품 id
      productId = res.body._id;

      expect(res.statusCode).toEqual(201);
      expect(productId).toBeDefined();
      expect(res.body.title).toBe(`${random}-product`);
      expect(res.body.manufacturer).toBe("삼성");
      expect(res.body.imageKey).toBe("test-product/test.png");
      expect(res.body.inventory).toBe(100);
    });
  });

  describe("get -> /api/productlist", () => {
    it("최소 3개의 제품 리스트 배열을 반환한다.", async () => {
      await request(app)
        .post("/api/product")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          title: `${random}-product1`,
          categoryId,
          manufacturer: "삼성",
          shortDescription: "테스트 제품입니다.",
          detailDescription: "테스트 제품의 자세한 설명입니다.",
          imageKey: "test-product/test.png",
          inventory: 100,
          price: 20000,
          searchKeywords: ["한국", "남자옷"],
        });

      await request(app)
        .post("/api/product")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          title: `${random}-product2`,
          categoryId,
          manufacturer: "삼성",
          shortDescription: "테스트 제품입니다.",
          detailDescription: "테스트 제품의 자세한 설명입니다.",
          imageKey: "test-product/test.png",
          inventory: 100,
          price: 20000,
          searchKeywords: ["한국", "남자옷"],
        });

      await request(app)
        .post("/api/product")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          title: `${random}-product3`,
          categoryId,
          manufacturer: "삼성",
          shortDescription: "테스트 제품입니다.",
          detailDescription: "테스트 제품의 자세한 설명입니다.",
          imageKey: "test-product/test.png",
          inventory: 100,
          price: 20000,
          searchKeywords: ["한국", "남자옷"],
        });

      const res = await request(app)
        .get("/api/productlist")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("get -> /api/productlist/category/:categoryTitle", () => {
    it("해당 카테고리의 제품들 목록을 반환한다.", async () => {
      const res = await request(app)
        .get(`/api/productlist/category/${categoryTitle}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("get -> /api/products/:productId", () => {
    it("제품 정보를 반환한다.", async () => {
      const res = await request(app)
        .get(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe(`${random}-product`);
      expect(res.body.imageKey).toBe("test-product/test.png");
      expect(res.body.shortDescription).toMatch("테스트 제품입니다.");
    });
  });

  describe("patch -> /api/products/:productId", () => {
    it("제품 정보의 수정이 정상적으로 이루어진다.", async () => {
      const res = await request(app)
        .patch(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          title: `${random}-product-999`,
          imageKey: "test-product/test-change.png",
          inventory: 50,
          searchKeywords: ["미국", "나이키"],
          isRecommended: true,
          discountPercent: 20,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe(`${random}-product-999`);
      expect(res.body.imageKey).toBe("test-product/test-change.png");
      expect(res.body.inventory).toBe(50);
      expect(res.body.isRecommended).toBe(true);
      expect(res.body.searchKeywords).toEqual(["미국", "나이키"]);
      expect(res.body.discountPercent).toBe(20);
    });
  });

  describe("delete -> /api/products/:productId", () => {
    it("제품 정보의 삭제가 정상적으로 이루어진다.", async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.result).toBe("success");
    });
  });
});
