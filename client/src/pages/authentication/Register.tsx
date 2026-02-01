import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Register.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { register, reset } from "../../features/auth/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isTechnician: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate("/home");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const name = formData.name;
    const email = formData.email;
    const password = formData.password;
    const isTechnician = formData.isTechnician;
    dispatch(register({ name, email, password, isTechnician }));
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Register</h1>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="username"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Are you a technician?</label>
          <input
            type="checkbox"
            id="username"
            name="isTechnician"
            onChange={() =>
              setFormData((prev) => ({
                ...prev,
                isTechnician: !prev.isTechnician,
              }))
            }
            required
          />
        </div>

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
