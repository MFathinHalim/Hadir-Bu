"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginForm() {
  const [kodeUnik, setKodeUnik] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null); // Token sebagai state
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kodeUnik, password }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.isFirstLogin) {
        window.location.href = "/ganti-password";
      } else {
        window.location.href = "/home";
      }
    } else {
      setErrorMessage(
        response.status === 401
          ? "Invalid username or password. Please try again."
          : "Server error. Please try again later.",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="kodeUnik"
          placeholder="kodeUnik"
          value={kodeUnik}
          onChange={(e) => setKodeUnik(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
