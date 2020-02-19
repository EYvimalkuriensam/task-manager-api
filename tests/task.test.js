const request = require("supertest");

const Task = require("../src/models/Task");
const app = require("../src/app");
const {
  userOneId,
  taskOneId,
  userOne,
  userTwo,
  setupDatabase
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/task")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From my test"
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should get tasks created by userOne", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("Should not delete taskOne by UserTwo", async () => {
  await request(app)
    .delete(`task/${taskOneId}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOneId);
  expect(task).not.toBeNull();
});
