import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout, {
  FormAlert,
  PasswordField,
  SubmitButton,
} from "./AuthLayout";

const strengthOf = (password) => {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^\w\s]/.test(password)) score += 1;
  return Math.min(score, 4);
};

const STRENGTH = [
  { label: "Too short", bar: "bg-red-500", text: "text-red-400" },
  { label: "Weak", bar: "bg-red-500", text: "text-red-400" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-400" },
  { label: "Good", bar: "bg-sky-500", text: "text-sky-400" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-400" },
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  // signing up never signs you in, so an existing session goes straight in
  if (user) return <Navigate to="/app" replace />;

  const score = useMemo(() => strengthOf(password), [password]);
  const strength = STRENGTH[score];
  const passwordLongEnough = password.length >= 6;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!passwordLongEnough) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    const result = await register(email, password, name);

    if (result.success) {
      navigate("/login", {
        replace: true,
        state: { justRegistered: result.message },
      });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Sign up"
      title="Create your account"
      subtitle="Set up an account, then sign in to start splitting."
      footer={
        <>
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Sign in
          </Link>
        </>
      }
    >
      <FormAlert>{error}</FormAlert>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="label">
            Full name
          </label>
          <div className="relative">
            <i className="fas fa-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aashish Shrestha"
              autoComplete="name"
              required
              className="field pl-11"
            />
          </div>
        </div>

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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          {password && (
            <div className="mt-2">
              <div className="flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      i < score ? strength.bar : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`mt-1 text-xs font-medium ${strength.text}`}
                aria-live="polite"
              >
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirm password
          </label>
          <div className="relative">
            <i className="fas fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              className="field pl-11"
            />
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs font-medium text-red-400">
              Passwords do not match yet
            </p>
          )}
        </div>

        <SubmitButton
          loading={loading}
          idleLabel="Create account"
          busyLabel="Creating account..."
        />

        <p className="text-center text-xs text-slate-500">
          Creating an account does not sign you in. You will be sent to the sign
          in screen.
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;