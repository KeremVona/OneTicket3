import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwtGenerator from "../../utils/jwtGenerator";
import {
  getUser,
  getUserById,
  registerUser,
} from "../../services/authentication/userService";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  isTechnician: boolean;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface GetIdRequestBody {
  id: string;
}

export const registerHandler = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
) => {
  const { name, email, password, isTechnician } = req.body;
  const send = {
    email: email,
    password: password,
    name: name,
    isTechnicianCheckbox: isTechnician,
  };

  try {
    const user = await getUser(email);

    if (user != 0) {
      return res.status(401).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    send.password = bcryptPassword;
    let newUser = await registerUser(send);

    if (newUser.field) {
      const jwtToken = jwtGenerator(
        newUser.id,
        newUser.name!,
        newUser.role,
        newUser.field,
      );

      return res.json({ jwtToken });
    } else {
      return res.status(400).send("Field is missing");
    }
  } catch (err) {
    console.error("Server error - registerHandler");
    if (err instanceof Error) {
      return res.status(500).send("Server error");
    }
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
) => {
  const { email, password } = req.body;
  try {
    const user = await getUser(email);

    if (user === 0) {
      return res.status(401).json("Invalid email");
    }

    const validPassword = bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json("Invalid pasword");
    }

    if (user.field) {
      const jwtToken = jwtGenerator(user.id, user.name!, user.role, user.field);

      return res.json({ jwtToken });
    } else {
      return res.status(400).send("Field is missing");
    }
  } catch (err) {
    console.error("Server error - loginHandler");
    if (err instanceof Error) {
      return res.status(500).send("Server error");
    }
  }
};

export const verifyHandler = async (res: Response) => {
  try {
    return res.json(true);
  } catch (err) {
    console.error("Server error - verifyHandler");
    if (err instanceof Error) {
      return res.status(500).send("Server error");
    }
  }
};

export const getUserIdHandler = async (
  req: Request<{}, {}, GetIdRequestBody>,
  res: Response,
) => {
  try {
    const { id } = req.body;

    const user = await getUserById(id);

    return res.json(user);
  } catch (err) {
    console.error("Server error - getUserIdHandler");
    return res.status(500).send("Server error");
  }
};
