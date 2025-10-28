import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser, registerUser } from "../api/auth.js";

// ---------- Input Component ----------
const Input = ({ id, label, type = "text", value, onChange, placeholder }) => (
  <label className="block text-sm w-full">
    <span className="text-black text-sm">{label}</span>
    <motion.input
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className="mt-1 block w-full rounded-lg bg-white border border-black text-black px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0C7489]"
    />
  </label>
);

// ---------- Login Form ----------
const LoginForm = ({ onLogin, email, setEmail }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    onLogin({ email, password }).finally(() => setLoading(false));
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <Input
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <Input
        id="login-password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex flex-wrap items-center justify-between text-xs text-black gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#0C7489]" /> <span>Remember me</span>
        </label>
        <button type="button" className="underline">
          Forgot?
        </button>
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold shadow-lg"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </motion.form>
  );
};

// ---------- Signup Form ----------
const SignupForm = ({ onSignup }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSignup({ fullName, email, password }).finally(() => setLoading(false));
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <Input
        id="signup-name"
        label="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        id="signup-password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-500 text-slate-900 font-semibold shadow-lg"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </motion.form>
  );
};

// ---------- Main AuthPages Component ----------
export default function AuthPages() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async ({ email, password }) => {
    setMessage({ type: "loading", text: "Checking credentials..." });
    try {
      const res = await loginUser({ email, password });
      const userData = res.user || res.data?.user || {};
      localStorage.setItem("token", res.token || res.data?.accessToken);
      login(userData);
      setMessage({ type: "success", text: "Logged in successfully!" });
      navigate("/dashboard");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Login failed" });
    }
  };

  const handleSignup = async ({ fullName, email, password }) => {
    setMessage({ type: "loading", text: "Creating your account..." });
    try {
      await registerUser({ fullName, email, password });
      setMessage({ type: "success", text: "Account created successfully!" });
      setMode("login");
      setLoginEmail(email);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Signup failed" });
    }
  };

  return (
    <div className="min-h-screen p-16 pt-24 md:pt-0 bg-black flex items-center justify-center relative overflow-x-hidden px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.16 }} className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 w-60 sm:w-72 h-60 sm:h-72 rounded-full bg-red-500 blur-3xl mix-blend-screen" />
        <div className="absolute -right-32 -bottom-32 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-pink-500 blur-3xl mix-blend-screen" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-4xl bg-gradient-to-b from-red-500 to-red-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Section */}
          <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center text-white bg-gradient-to-b from-transparent via-white/3 to-transparent">
            <motion.h2
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold"
            >
              Welcome back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-md sm:text-base text-white/80 max-w-sm"
            >
              Access your dashboard and manage your classes, assignments, and admin tasks — beautifully animated and role-aware.
            </motion.p>

            <div className="mt-6">
              <p className="text-center mt-6 sm:mt-10 text-md">
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button onClick={() => setMode("login")} className="font-medium text-white hover:underline">
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button onClick={() => setMode("signup")} className="font-medium text-white hover:underline">
                      Sign Up
                    </button>
                  </>
                )}
              </p>
              {message && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-3 rounded-md bg-white/6 text-white text-sm">
                  {message.text}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="p-6 sm:p-8 md:p-12 bg-white flex items-center">
            <div className="w-full max-w-sm mx-auto text-black">
              <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-transparent">
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {mode === "login" ? "Sign in" : "Create account"}
                </h3>

                <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {mode === "login" ? (
                    <LoginForm onLogin={handleLogin} email={loginEmail} setEmail={setLoginEmail} />
                  ) : (
                    <SignupForm onSignup={handleSignup} />
                  )}
                </motion.div>

                <div className="mt-4 text-center text-xs text-black">or continue with</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button className="flex-1 py-2 rounded-lg bg-white/6 border border-black text-black">
                    Google
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-white/6 border border-black text-black">
                    GitHub
                  </button>
                </div>

                <div className="mt-4 text-xs text-black text-center">
                  <span>
                    By continuing you agree to our <u>Terms</u> and <u>Privacy</u>.
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
