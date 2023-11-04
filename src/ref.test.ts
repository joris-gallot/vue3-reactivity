import { test, expect } from "vitest";
import { ref, effect } from "./ref";

test("ref string", () => {
  const nameRef = ref("Michael");

  let name;

  effect(() => {
    name = nameRef.value;
  });

  expect(name).toBe("Michael");

  nameRef.value = "Alice";

  expect(name).toBe("Alice");
});
