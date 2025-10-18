import Image from "next/image";
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const SP = await searchParams;
  const next = typeof SP.next === "string" ? SP.next : undefined;
  return (
    <div className="my-10 flex w-md flex-col items-center justify-center">
      <div className="bg-brand-primary-600 mx-auto flex w-full items-center justify-center rounded-t-xl p-4">
        <Image
          src="/images/logo.svg"
          alt="Gomago CRM Logo"
          width={192}
          height={44}
        />
      </div>
      <div className="w-full space-y-4 rounded-b-xl bg-white p-4 shadow-md">
        <h1 className="text-brand-gray-600 text-center text-lg font-semibold">
          Sign in to your account
        </h1>

        <LoginForm next={next} />
      </div>
    </div>
  );
}
