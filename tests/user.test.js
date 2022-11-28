import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../src/app";

describe("user 관련 테스트", () => {
  // 임시 랜덤 문자열 제작용
  const random = Math.random().toString(36).substring(2, 7);

  // 여러 테스트에서 공통으로 쓸 토큰
  let token;
  let userId;

  const address = {
    postalCode: "12345",
    address1: "서울시 oo로 00빌딩",
    address2: "3층 991호",
  };

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("post -> /api/register", () => {
    it("유저 db에 사용자 정보가 추가된다.", async () => {
      const res = await request(app)
        .post("/api/register")
        .set("Content-Type", "application/json")
        .send({
          fullName: "tester",
          email: `${random}@def.com`,
          password: "1234",
        });

      userId = res.body._id;

      expect(res.statusCode).toEqual(201);
      expect(res.body.fullName).toBe("tester");
      expect(res.body.email).toBe(`${random}@def.com`);
    });
  });

  describe("post -> /api/login", () => {
    it("로그인 성공 시, jwt 토큰을 반환한다.", async () => {
      const res = await request(app)
        .post("/api/login")
        .set("Content-Type", "application/json")
        .send({ email: `${random}@def.com`, password: "1234" });

      token = res.body.token;

      expect(res.statusCode).toEqual(200);
      expect(token).toBeDefined();
    });
  });

  describe("get -> /api/userlist", () => {
    it("최소 3명의 유저 리스트 배열을 반환한다.", async () => {
      await request(app)
        .post("/api/register")
        .set("Content-Type", "application/json")
        .send({
          fullName: "tester1",
          email: `${random}1@def.com`,
          password: "1234",
        });
      await request(app)
        .post("/api/register")
        .set("Content-Type", "application/json")
        .send({
          fullName: "tester2",
          email: `${random}2@def.com`,
          password: "1234",
        });
      await request(app)
        .post("/api/register")
        .set("Content-Type", "application/json")
        .send({
          fullName: "tester3",
          email: `${random}3@def.com`,
          password: "1234",
        });

      const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
      const adminToken = jwt.sign({ userId, role: "admin" }, secretKey);

      const res = await request(app)
        .get("/api/userlist")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("get -> /api/user/", () => {
    it("사용자 정보를 반환한다.", async () => {
      const res = await request(app)
        .get(`/api/user/`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toBe(`${random}@def.com`);
    });
  });

  describe("patch -> /api/users/:userId", () => {
    it("사용자 정보의 수정이 정상적으로 이루어진다.", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          fullName: "tester-changed",
          address,
          phoneNumber: "01012345678",
          currentPassword: "1234",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.fullName).toBe("tester-changed");
      expect(res.body.address).toEqual(address);
      expect(res.body.phoneNumber).toBe("01012345678");
    });
  });

  describe("get -> /api/admin/check", () => {
    it("관리자 토큰이 아니라면 403 status code를 반환한다.", async () => {
      const res = await request(app)
        .get(`/api/admin/check`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.reason).toMatch(/관리자/);
    });

    it("관리자 토큰이라면 200 status code를 반환한다.", async () => {
      const secretKey = process.env.JWT_SECRET_KEY || "secret-key";

      const adminToken = jwt.sign({ userId, role: "admin" }, secretKey);
      const res = await request(app)
        .get(`/api/admin/check`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.result).toBe("success");
    });
  });

  describe("post -> /api/user/password/check", () => {
    it("비밀번호가 일치한다면 사용자 정보를 반환한다.", async () => {
      const res = await request(app)
        .post(`/api/user/password/check`)
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          password: "1234",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.fullName).toBe("tester-changed");
    });
  });

  describe("delete -> /api/users/:userId", () => {
    it("사용자 정보의 삭제가 정상적으로 이루어진다.", async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.result).toBe("success");
    });
  });
});
