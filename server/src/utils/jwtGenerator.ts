import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env", quiet: true });

function jwtGenerator(
  user_id: string,
  user_name: string,
  user_role: string,
  user_field: string,
) {
  const payload = {
    user: {
      id: user_id,
      username: user_name,
      role: user_role,
      field: user_field,
    },
  };

  //console.log(user_id, user_name);

  const secret = process.env.Secret;

  if (!secret) {
    console.log("Secret not in .env");
    throw new Error("Secret not in .env");
  }

  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export default jwtGenerator;
