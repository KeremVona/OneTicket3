import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      const { jwtToken } = response.data;

      localStorage.setItem("token", jwtToken);
      // TODO:
      // Add a message that displays that the user is going to be navigated
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };
  return (
    <div className="login-container">
      <form className="login-form">
        <h1>Login</h1>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="username"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <button type="submit" className="btn-login">
          Sign In
        </button>

        <div className="form-footer">
          <a href="#">Forgot Password?</a>
        </div>
      </form>
      <div className="animation-bg"></div>
    </div>
  );
};

export default Register;
