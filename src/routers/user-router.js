import { Router } from "express";
import { adminOnly, loginRequired } from "../middlewares";
import { userService } from "../services";

const userRouter = Router();

// API done
userRouter.post("/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const userInfo = { fullName, email, password };
    const createdUser = await userService.addUser(userInfo);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});

// API done
userRouter.post("/login", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const loginInfo = { email, password };
    const loginResult = await userService.loginAndGetToken(loginInfo);
    res.status(200).json(loginResult);
  } catch (error) {
    next(error);
  }
});

// API done
userRouter.post(
  "/user/password/check",
  loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const { password } = req.body;
      const passwordMatch = await userService.checkPassword(userId, password);
      res.status(200).json(passwordMatch);
    } catch (error) {
      next(error);
    }
  }
);

//api don
userRouter.get("/userlist", adminOnly, async function (req, res, next) {
  try {
    const foundUsers = await userService.getAllUsers();
    res.status(200).json(foundUsers);
  } catch (error) {
    next(error);
  }
});

//adpi done
userRouter.get("/user", loginRequired, async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    const foundUser = await userService.getUserById(userId);
    res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
});

// api done
userRouter.patch(
  "/users/:userId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { userId } = req.params;
      const { fullName, password, address, phoneNumber, currentPassword } =
        req.body;
      // const updateInfo = {
      //   fullName,
      //   password,
      //   address,
      //   phoneNumber,
      // };
      if (!currentPassword) {
        throw new Error("회원정보를 수정하려면 비밀번호가 필요합니다.");
      }
      const userInfo = { userId, currentPassword };
      const updateInfo = {
        ...(fullName && { fullName }),
        ...(password && { password }),
        ...(address && { address }),
        ...(phoneNumber && { phoneNumber }),
      };
      const updatedUser = await userService.setUser(userInfo, updateInfo);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

//api done
userRouter.patch(
  "/users/role/:userId",
  adminOnly,
  async function (req, res, next) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const updatedUser = await userService.setRole(userId, role);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

//adpi done
userRouter.post(
  "/user/deliveryinfo",
  loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const { address, phoneNumber } = req.body;
      const updateInfo = {
        address,
        phoneNumber,
      };
      // const deliveryinfo = {
      //   ...(address && { address }),
      //   ...(phoneNumber && { phoneNumber }),
      // };
      const updatedUser = await userService.setDeliveryInfo(userId, updateInfo);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// api done
userRouter.delete(
  "/users/:userId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { userId } = req.params;
      const deleteResult = await userService.removeUserById(userId);
      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

//api done
userRouter.get("/admin/check", adminOnly, async function (req, res, next) {
  try {
    res.status(200).json({ result: "success" });
  } catch (error) {
    next(error);
  }
});

export { userRouter };
