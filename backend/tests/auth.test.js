const supertest = require("supertest");
const mongoose = require("mongoose");
const config = require("../utils/config");
const connectDB = require("../config/db");
const app = require("../app");
const User = require("../models/userModel");
const api = supertest(app);
const bcrypt = require("bcryptjs");


const SIGNUP_URL = "/api/users/signup";
const LOGIN_URL = "/api/users/login";

const validUser = {
  username: "test",
  password: "123123!",
  phoneNumber: "+2312412314",
  name: "test",
  role: "user",
};

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertOne(validUser);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/users/signup", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("creates a user and returns username + token", async () => {
    const res = await api.post(SIGNUP_URL).send(validUser).expect(201);
    expect(res.body.username).toBe(validUser.username);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it("should persist the user in the database", async () => {
      await api.post(SIGNUP_URL).send(validUser).expect(201);

      const savedUser = await User.findOne({ email: validUser.email });
      expect(savedUser).not.toBeNull();
      expect(savedUser.name).toBe(validUser.name);
    });

  it("stores a hashed password, not the plain one", async () => {
    await api.post(SIGNUP_URL).send(validUser).expect(201);
    const saved = await User.findOne({ username: validUser.username });
    expect(saved.password).not.toBe(validUser.password);
    expect(saved.password).toMatch(/^\$2[aby]\$/); // bcrypt hash prefix
  });

  it("returns 400 when a required field is missing", async () => {
    const { phoneNumber, ...invalid } = validUser;
    const res = await api.post(SIGNUP_URL).send(invalid).expect(400);
    expect(res.body.error).toBeDefined();
    expect(await User.countDocuments()).toBe(0);
  });

  it("returns 400 when the username is already in use", async () => {
    await api.post(SIGNUP_URL).send(validUser).expect(201);
    const res = await api
      .post(SIGNUP_URL)
      .send({ ...validUser, username: "test" })
      .expect(400);
    expect(res.body.error).toMatch(/username already in use/i);
  });
});

const existingUser =
{
    username: "test2",
    password: "123123!",
    phoneNumber: "+2312412314",
    name: "test",
    role: "user",
}

describe("POST /api/users/login", () => {
    
  it("returns 200 and a token for valid credentials", async () => {
    const user = await api.post(SIGNUP_URL).send(existingUser).expect(201);
    const res = await api
      .post(LOGIN_URL)
      .send({username: existingUser.username, password: existingUser.password})
      .expect(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.username).toBe(existingUser.username);
  });

  it("should return status 200", async () => {
    const user = await api.post(SIGNUP_URL).send(existingUser).expect(201);

      await api
        .post(LOGIN_URL)
        .send({
          username: existingUser.username,
          password: existingUser.password,
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

  it("returns 400 for a wrong password", async () => {
    const res = await api
      .post(LOGIN_URL)
      .send({ username: validUser.username, password: "wrong-password" })
      .expect(400);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it("returns 400 for an unknown user", async () => {
    await api
      .post(LOGIN_URL)
      .send({ username: "nobody", password: validUser.password })
      .expect(400);
  });

  it("returns 400 when fields are missing", async () => {
    await api.post(LOGIN_URL).send({ username: validUser.username }).expect(400);
    await api.post(LOGIN_URL).send({ password: validUser.password }).expect(400);
  });
});
