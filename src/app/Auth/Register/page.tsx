"use client";

import { useState } from "react";

import Link from "next/link";
import { DocReviewLogo } from "@/components/dashboard/logo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { showSuccessToast } from "@/components/toasts/SuccessToast";
import { showErrorToast } from "@/components/toasts/ErrorToast";
import { showValidationToast } from "@/components/toasts/ValidationToast";
import { registerUser } from "@/service/auth";
import { useAuthStore } from "@/store/auth-store";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/validation/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const res = await registerUser(values.email, values.password, values.username);
    if (res.success && res.user) {
      showSuccessToast("Account created successfully! Please login.");
      router.push("/Auth/Login");
    } else {
      showErrorToast(res.error || "Failed to create account");
    }
  }

  function onError(errors: any) {
    // Show the first validation error as a toast
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      showValidationToast(firstError.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#e8e4df]">
        <div className="text-center mb-8">
          <DocReviewLogo destination="/" textColor="text-slate-700" className="justify-center" />
          <p className="text-gray-500 text-sm mt-2">Sign up to get started</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-5" autoComplete="off">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name.."
                      autoComplete="off"
                      {...field}
                      className="rounded-xl border-gray-300 py-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Email Address*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email.."
                      autoComplete="off"
                      {...field}
                      className="rounded-xl border-gray-300 py-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Your Password.."
                        autoComplete="new-password"
                        {...field}
                        className="rounded-xl border-gray-300 py-5 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Confirm Password*
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Enter your password.."
                        autoComplete="new-password"
                        {...field}
                        className="rounded-xl border-gray-300 py-5 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="mybutton"
              disabled={form.formState.isSubmitting}
              className="w-full py-6 mt-2 rounded-xl font-bold text-base shadow-md"
            >
              {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/Auth/Login"
            className="font-semibold text-[#1a1a1a] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
