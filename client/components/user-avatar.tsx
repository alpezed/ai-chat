import { authClient } from "@/lib/auth-client";
import type { User } from "better-auth";
import { useEffect, useState } from "hono/jsx";

export function UserAvatar() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      const { data: session } = await authClient.getSession();
      setUser(session?.user);
    })();
  }, []);

  return (
    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
      {user?.image ? (
        <img src={user.image} className="h-full w-full rounded-full" />
      ) : (
        <svg
          style="width: 1em; height: 1em; vertical-align: middle; fill: currentcolor; overflow: hidden;"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M170.666667 938.666667a341.333333 341.333333 0 1 1 682.666666 0h-85.333333a256 256 0 1 0-512 0H170.666667z m341.333333-384c-141.44 0-256-114.56-256-256s114.56-256 256-256 256 114.56 256 256-114.56 256-256 256z m0-85.333334c94.293333 0 170.666667-76.373333 170.666667-170.666666s-76.373333-170.666667-170.666667-170.666667-170.666667 76.373333-170.666667 170.666667 76.373333 170.666667 170.666667 170.666666z"></path>
        </svg>
      )}
    </div>
  );
}
