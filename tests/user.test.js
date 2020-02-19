const request = require("supertest");
const app = require("../src/app");

const User = require("../src/models/User");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/user")
    .send({
      name: "Vimal",
      email: "vimal@example.com",
      password: "Red12345!"
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "Vimal",
      email: "vimal@example.com"
    },
    token: user.tokens[0].token
  });

  expect(user.password).not.toBe("Red12345!");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  const user = await User.findById(response.body.user._id);
  expect(user.tokens[user.tokens.length - 1].token).toBe(response.body.token);
});

test("Should not login non-existent user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: "noemail@example.com",
      password: "notavalidone"
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/user/me")
    .send()
    .expect(401);
});

test("Should delete user account", async () => {
  const response = await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete user account for unauthenticated user", async () => {
  await request(app)
    .delete("/user/me")
    .send()
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/user/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  const updationFields = {
    name: "Mathew"
  };
  const response = await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(updationFields)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual(updationFields.name);
});

test("Should not update invalid user fields", async () => {
  const updationFields = {
    height: 150,
    wieght: 250
  };
  await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(updationFields)
    .expect(404);
});
