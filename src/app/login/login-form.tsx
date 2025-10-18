"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/features/auth/schema";
import { loginAction } from "@/features/auth/actions";
import { ReactComponent as ProgressArc } from "@/icons/progress-arc-default.svg";
import { useTransition } from "react";

export default function LoginForm({ next }: { next: string | undefined }) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await loginAction(data, next);

      if (!result!.ok) {
        setError("root", {
          type: "server",
          message: result!.error || "Login failed.",
        });
        return;
      }
    });
  });

  const busy = isSubmitting || isPending;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="w-full space-y-4 bg-inherit"
    >
      {/* Email */}
      <div className="relative bg-inherit">
        <label
          htmlFor="email"
          className="text-brand-gray-500 absolute -top-2 left-3 bg-inherit px-2 text-sm"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${errors.email ? "border-brand-error-500 focus:brand-error-red-500" : "focus:border-brand-primary-500 border-brand-gray-300"} text-brand-gray-600 h-10 w-full rounded-md border-1 px-3 py-2 text-sm font-medium focus:outline-none`}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-brand-error-500 mt-1 text-xs">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="relative bg-inherit">
        <label
          htmlFor="password"
          className="text-brand-gray-500 absolute -top-2 left-3 bg-inherit px-2 text-sm"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          aria-invalid={!!errors.password || undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={`${errors.password ? "border-brand-error-500 focus:brand-error-red-500" : "focus:border-brand-primary-500 border-brand-gray-300"} text-brand-gray-600 h-10 w-full rounded-md border-1 px-3 py-2 text-sm font-medium focus:outline-none`}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-brand-error-500 mt-1 text-xs">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="text-md disabled:bg-brand-gray-400 enabled:bg-brand-primary-500 enabled:hover:bg-brand-primary-600 enabled:focus:bg-brand-primary-600 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-white transition focus:outline-none enabled:cursor-pointer disabled:cursor-not-allowed"
      >
        {busy ? (
          <>
            <span className="text-sm">Signing in</span>
            <ProgressArc className="arc-spinner size-4 text-white" />
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {errors.root?.message && (
        <p className="text-brand-error-500 text-xs">{errors.root.message}</p>
      )}
    </form>
  );
}
