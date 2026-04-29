"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log(values);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#e8e4df]">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center text-xl font-bold tracking-tight text-[#1a1a1a] mb-2 cursor-pointer">
            <img
              src="/images/browser-icon.png"
              alt="DocuReview"
              className="w-6 h-6 mr-2"
            />
            DocuReview<span className="text-[#c96442]">.</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign up to get started</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name.."
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
                    <Input
                      type="password"
                      placeholder="Enter Your Password.."
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Confirm Password*
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password.."
                      {...field}
                      className="rounded-xl border-gray-300 py-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="mybutton"
              className="w-full py-6 mt-2 rounded-xl font-bold text-base shadow-md"
            >
              Sign Up
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
