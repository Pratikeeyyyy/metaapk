import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout, {
  FormAlert,
  PasswordField,
  SubmitButton,
} from "./AuthLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // signed in users skip this screen
  if (user) return <Navigate to="/app" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/app", { replace: true });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Sign in to pick a currency and start splitting."
      footer={
        <>
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Create an account
          </Link>
        </>
      }
    >
      <FormAlert>{error}</FormAlert>
      {!error && location.state?.justRegistered && (
        <FormAlert tone="success">
          {location.state.justRegistered}
        </FormAlert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="relative">
            <i className="fas fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="field pl-11"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <PasswordField
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </div>

        <SubmitButton
          loading={loading}
          idleLabel="Sign in"
          busyLabel="Signing in..."
        />
      </form>

      {notice && <p className="mt-4 text-center text-sm">{notice}</p>}

      <p className="mt-6 text-center text-xs text-slate-500">
        Signing in here is the only way into the app. New accounts start at the
        sign up screen and come back here.
      </p>
    </AuthLayout>
  );
};

export default Login;