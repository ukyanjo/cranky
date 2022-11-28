import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories";

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  passwordMatch = function (foundUser, password) {
    const hashedPassword = foundUser.password;
    const passwordMatch = bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      throw new Error(
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }
  };

  async addUser(userInfo) {
    const { email, fullName, password } = userInfo;
    console.log("this done");
    const foundUser = await this.userRepository.findByEmail(email);
    if (foundUser) {
      throw new Error(
        "해당 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserInfo = { fullName, email, password: hashedPassword };
    const createdUser = await this.userRepository.create(newUserInfo);
    return createdUser;
  }

  async getUserById(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }
    return user;
  }

  async getAllUsers() {
    const foundUsers = await this.userRepository.findAll();
    return foundUsers;
  }

  async setUser(userInfo, updateInfo) {
    const { userId, currentPassword } = userInfo;
    let foundUser = await this.userRepository.findById(userId);
    if (!foundUser) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }
    this.passwordMatch(foundUser, currentPassword);
    // const correctPasswordHash = user.password;
    // const passwordMatch = await bcrypt.compare(
    //   currentPassword,
    //   correctPasswordHash
    // );
    // if (!passwordMatch) {
    //   throw new Error(
    //     "현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
    //   );
    // }
    const { password } = updateInfo;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateInfo.password = hashedPassword;
    }
    const updatedUser = await this.userRepository.update({
      userId,
      updateInfo,
    });
    return updatedUser;
  }

  async removeUserById(userId) {
    const { deletedCount } = await this.userRepository.deleteById(userId);
    if (deletedCount === 0) {
      throw new Error(`${userId} 사용자 데이터의 삭제에 실패하였습니다.`);
    }
    return { result: "success" };
  }

  async loginAndGetToken(loginInfo) {
    const { email, password } = loginInfo;
    const foundUser = await this.userRepository.findByEmail(email);
    if (!foundUser) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    this.passwordMatch(foundUser, password);
    // const hashedPassword = foundUser.password;
    // const passwordMatch = await bcrypt.compare(password, hashedPassword);
    // if (!passwordMatch) {
    //   throw new Error(
    //     "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
    //   );
    // }
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const token = jwt.sign(
      { userId: foundUser._id, role: foundUser.role },
      secretKey
    );
    const isAdmin = foundUser.role === "admin";
    return { token, isAdmin };
  }

  async checkPassword(userId, password) {
    const foundUser = await this.userRepository.findById(userId);
    this.passwordMatch(foundUser, password);
    // const correctPasswordHash = user.password;
    // const passwordMatch = await bcrypt.compare(password, correctPasswordHash);
    // if (!passwordMatch) {
    //   throw new Error(
    //     "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
    //   );
    // }
    return foundUser;
  }

  async setRole(userId, role) {
    const updatedUser = await this.userRepository.update({
      userId,
      updateInfo: { role },
    });
    return updatedUser;
  }

  async setDeliveryInfo(userId, updateInfo) {
    const updatedUser = await this.userRepository.update({
      userId,
      updateInfo,
    });
    return updatedUser;
  }
}

const userService = new UserService(userRepository);

export { userService };
