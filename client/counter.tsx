import { render, useState } from "hono/jsx/dom";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button className="border-0" onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button className="border-0" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

const root = document.getElementById("counter");

if (!root) {
  throw new Error("Root element not found");
}

render(<Counter />, root);
