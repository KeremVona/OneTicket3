import { Role, Field, TicketStatus, Prisma } from "@prisma/client";
import { prisma } from "../../prisma.js";

// --------------------------------------
// 1. User Registration Logic
// --------------------------------------

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  isTechnicianCheckbox: boolean;
}

export const registerUser = async (input: RegisterInput) => {
  let role: Role = Role.EMPLOYEE;
  let field: Field | null = null;

  // 1. Check for Admin
  if (input.email.endsWith("@admin.com")) {
    role = Role.ADMIN;
  }
  // 2. Check for Technician
  else if (input.isTechnicianCheckbox) {
    if (input.email.endsWith("@hardware.com")) {
      role = Role.TECHNICIAN;
      field = Field.HARDWARE;
    } else if (input.email.endsWith("@software.com")) {
      role = Role.TECHNICIAN;
      field = Field.SOFTWARE;
    } else {
      throw new Error(
        "Technician email must end in @hardware.com or @software.com",
      );
    }
  }

  // 3. Make User
  const hashedPassword = input.password;

  return await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: role,
      field: field,
    },
  });
};

// --------------------------------------
// 2. Login User
// --------------------------------------

export const loginUser = async (email: string, passwordPlain: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  // TODO: Compare password (e.g. await bcrypt.compare(passwordPlain, user.password))
  const isPasswordValid = passwordPlain === user.password;

  if (!isPasswordValid) throw new Error("Invalid password");

  return user; // Return user to generate JWT token usually
};

export const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (user) {
    return user;
  }
  return 0;
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id: id } });
  if (user) {
    return user;
  }
  return 0;
};
