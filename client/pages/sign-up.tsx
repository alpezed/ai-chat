import { Input } from "@/client/components/input";
import { authClient } from "@/lib/auth-client";
import { render, useState } from "hono/jsx/dom";

function SignUp() {
  const [formValue, setFormValue] = useState({
    name: "",
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
    const { data, error } = await authClient.signUp.email(
      {
        ...formValue,
        callbackURL: "/",
      },
      {
        onRequest: ctx => {
          console.log("--onRequest", ctx);
        },
        onSuccess: ctx => {
          console.log("--onSuccess", ctx);
        },
        onError: ctx => {
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
          Sign Up
        </h3>
        <p class="block antialiased font-sans text-base leading-relaxed mb-10 text-gray-600 font-normal text-[18px]">
          Enter your personal information to sign up
        </p>
        <form onSubmit={onSubmit} class="mx-auto max-w-[24rem] text-left">
          <Input
            name="name"
            placeholder="Enter your name"
            label="Your Name"
            onChange={onChangeInput}
          />
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
          >
            create an account
          </button>
          <p class="block antialiased font-sans text-sm leading-normal text-gray-700 !mt-4 text-center font-normal">
            Already signup?{" "}
            <a href="#" class="font-medium text-gray-900">
              Signin account
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

render(<SignUp />, root);
