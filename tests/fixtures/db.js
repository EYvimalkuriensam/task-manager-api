const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../../src/models/User");
const Task = require("../../src/models/Task");

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const taskOneId = new mongoose.Types.ObjectId();
const taskTwoId = new mongoose.Types.ObjectId();
const taskThreeId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@example.com",
  password: "Red12345!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const userTwo = {
  _id: userTwoId,
  name: "Jason",
  email: "jason@example.com",
  password: "TestCase12345()",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};

const taskOne = {
  _id: taskOneId,
  description: "First Task",
  completed: false,
  owner: userOneId
};

const taskTwo = {
  _id: taskTwoId,
  description: "Second Task",
  completed: false,
  owner: userOneId
};

const taskThree = {
  _id: taskThreeId,
  description: "Third Task",
  completed: true,
  owner: userTwoId
};

const setupDatabase = async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userTwoId,
  taskOneId,
  taskTwoId,
  taskThreeId,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
};
