import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import questions from "./data/questions.js";
import answers from "./data/answers.js";
import User from "./model/userModel.js";
import Question from "./model/questionModel.js";
import Answer from "./model/answerModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Answer.deleteMany();
    await Question.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleQuestions = questions.map((question) => {
      question.comments[0].user = adminUser;
      return { ...question, owner: adminUser };
    });

    await Question.insertMany(sampleQuestions);

    const email = createdUsers[2].email;
    const { title, description } = sampleQuestions[2];

    const user = await User.find({ email });
    const question = await Question.find({ title, description });

    answers[0].user = user[0]._id;
    answers[0].toQuestion = question[0]._id;
    const sampleAnswer = await Answer.insertMany(answers);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Answer.deleteMany();
    await Question.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
