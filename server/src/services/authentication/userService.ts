import { Role, Field } from "@prisma/client";
import { prisma } from "../../prisma.js";
import { getDomainName } from "../../utils/helper.js";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  isTechnicianCheckbox: boolean;
}

export const registerUser = async (input: RegisterInput) => {
  let role: Role = Role.EMPLOYEE;
  let field: Field | null = null;
  const domain = getDomainName(input.email);

  if (input.email.endsWith("@admin.com")) {
    role = Role.ADMIN;
  } else if (input.isTechnicianCheckbox) {
    if (!domain) {
      throw new Error("Invalid email format");
    }

    role = Role.TECHNICIAN;

    const fieldKey = domain.toUpperCase() as keyof typeof Field;

    if (!Field[fieldKey]) {
      throw new Error(
        "Technician email must end in a valid field domain (e.g. @hardware.com, @software.com)",
      );
    }

    field = Field[fieldKey];
  }

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
