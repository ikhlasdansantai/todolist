"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, ArrowRight, LogIn, User } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const BASE_URL = "http://94.74.86.174:8080/api/";

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

interface ApiResponse {
  token?: string;
  access_token?: string;
  message?: string;
  [key: string]: any;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res: Response = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      localStorage.setItem("token", data.data.token as string);
      router.push("/login");
    } catch (error: unknown) {
      console.error("Login error:", error);

      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";

      if (errorMessage.includes("401")) {
        alert("Invalid username or password");
      } else if (errorMessage.includes("400")) {
        alert("Please check your input");
      } else {
        alert(`Login failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-lg shadow-lg border border-slate-800 p-8">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
          </CardHeader>
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="username" className="text-sm font-medium text-slate-400">
                Username
              </label>
              <div className="relative text-slate-00">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.username ? "border-red-500" : "border-slate-300"}`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative text-slate-00">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500" : "border-slate-300"}`}
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-200 hover:text-slate-400 transition-colors cursor-pointer">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            <Button type="button" variant="default" size="lg" onClick={handleSubmit} disabled={isLoading} className="w-full font-medium rounded-md focus:ring-offset-2 flex items-center justify-center space-x-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
