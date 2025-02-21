import { Input } from "@/client/components/input";
import { authClient } from "@/lib/auth-client";
import { render, useState } from "hono/jsx/dom";

function SignIn() {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e: any) => {
    setFormValue(prevValues => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    const { data, error } = await authClient.signIn.email(
      {
        ...formValue,
        callbackURL: "/chat",
        rememberMe: false,
      },
      {
        onError: ctx => {
          if (ctx.error.status === 403) {
            alert("Please verify your email address");
          }
          alert(ctx.error.message);
        },
      }
    );

    console.log({ data, error });
  };

  return (
    <section class="grid text-center h-screen items-center p-8">
      <div>
        <h3 class="block antialiased tracking-normal font-sans text-3xl font-semibold leading-snug text-blue-gray-900 mb-2">
          Sign In
        </h3>
        <p class="block antialiased font-sans text-base leading-relaxed mb-10 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </p>
        <form onSubmit={onSubmit} class="mx-auto max-w-[24rem] text-left">
          <Input
            type="email"
            name="email"
            placeholder="name@mail.com"
            label="Your Email"
            onChange={onChangeInput}
          />
          <Input
            type="password"
            name="password"
            placeholder="********"
            label="Password"
            onChange={onChangeInput}
          />
          <button
            class="align-middle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-3.5 px-7 rounded-lg text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none bg-gray-900 block w-full gap-3 mt-6"
            type="submit"
            data-ripple-light="true"
          >
            sign in
          </button>
          <div class="!mt-4 flex justify-end">
            <a
              href="#"
              class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-medium"
            >
              Forgot password
            </a>
          </div>
          <button
            class="align-middle cursor-pointer select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-3.5 px-7 rounded-lg border border-gray-900 text-gray-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] w-full mt-6 flex h-12 items-center justify-center gap-2 uppercase"
            type="button"
            data-ripple-dark="true"
          >
            <img
              src="https://www.material-tailwind.com/logos/logo-google.png"
              alt="google"
              class="h-6 w-6"
            />
            Sign in with google
          </button>
          <p class="block antialiased font-sans text-sm leading-normal text-gray-700 !mt-4 text-center font-normal">
            Not registered?{" "}
            <a href="/sign-up" class="font-medium text-gray-900">
              Create account
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}

const root = document.getElementById("auth");

if (!root) {
  throw new Error("Root element not found");
}

render(<SignIn />, root);
