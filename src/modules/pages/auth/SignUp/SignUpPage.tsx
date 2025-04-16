import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { EyeClosed, EyeIcon } from "lucide-react";

import { FullWidthButton } from "../../../components/ui/Button";
import "../SignIn/signIn.scss";
import { useAuth } from "../../../../app/useAuth";

type FormData = {
  email: string;
  password: string;
};

export const SignUpPage = () => {
  const [isPassword, setIsPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { handleSignup, handleGoogleLogin } = useAuth();

  const onSubmit = async (data: FormData) => {
    return handleSignup(data.email, data.password);
  };

  return (
    <div className="sign-in">
      <div className="sign-in__wrapper">
        <div className="sign-in__form">
          <span>Start your journey</span>
          <h1 className="sign-in__title">Sign Up</h1>
          <Link className="sign-in__notification" to="/auth/sign-in">
            Already have an account?
          </Link>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="sign-in__input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className={errors.email ? "input-error" : ""}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>
            <div className="sign-in__input">
              <label htmlFor="password">Password</label>
              <input
                type={!isPassword ? "password" : "text"}
                id="password"
                className={errors.password ? "input-error" : ""}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Must contain at least one uppercase letter",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Must contain at least one lowercase letter",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Must contain at least one number",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                      "Must contain at least one special character",
                  },
                })}
              />
              {isPassword ? (
                <EyeIcon onClick={() => setIsPassword(!isPassword)} />
              ) : (
                <EyeClosed onClick={() => setIsPassword(!isPassword)} />
              )}
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>
            <a className="sign-in__notification" href="#">
              Forget password?
            </a>
            <FullWidthButton className="sign-in__submit" type="submit">
              Sign Up
            </FullWidthButton>
          </form>
          <span className="sign-in__with">or sign up with</span>
          <div className="sign-in__social">
            <button onClick={handleGoogleLogin}>
              <img src="/img/icons/google.svg" alt="google" />
            </button>
            <button>
              <img src="/img/icons/apple.svg" alt="apple" />
            </button>
          </div>
        </div>
      </div>
      <div className="sign-in__img">
        <img src="/img/bg/bg_auth_image.jpeg" alt="bg img" />
      </div>
    </div>
  );
};
