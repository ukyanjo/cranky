import { model } from "mongoose";
import { UserSchema } from "./schemas";

const User = model("users", UserSchema);

export class UserRepository {
  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  async findByEmail(email) {
    const foundUser = await User.findOne({ email });
    return foundUser;
  }

  async findById(userId) {
    const foundUser = await User.findOne({ _id: userId });
    return foundUser;
  }

  async findAll() {
    const foundUsers = await User.find({});
    return foundUsers;
  }

  async update({ userId, updateInfo }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };
    const updatedUser = await User.findOneAndUpdate(filter, updateInfo, option);
    return updatedUser;
  }

  async deleteById(userId) {
    const result = await User.deleteOne({ _id: userId });
    return result;
  }
}

const userRepository = new UserRepository();

export { userRepository };
