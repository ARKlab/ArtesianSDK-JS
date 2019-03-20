import {
  CircuitBreaker,
  defaultCircuitBreakerOptions
} from "../src/Common/CircuitBreaker";
import { timer } from "./helpers";

describe("CircuitBreaker", () => {
  test("Passes through service success", () => {
    const service = () => Promise.resolve("we good");
    const circuit = CircuitBreaker(defaultCircuitBreakerOptions, service);

    return expect(circuit(1)).resolves.toEqual("we good");
  });
  test("Passes through service failures", () => {
    const service = () => Promise.reject("no bueno");
    const circuit = CircuitBreaker(defaultCircuitBreakerOptions, service);

    expect(circuit(1)).rejects.toEqual("no bueno");
  });
  test("Breaks after 3 failures", async () => {
    const service = () => Promise.reject("no bueno");
    const circuit = CircuitBreaker(defaultCircuitBreakerOptions, service);

    await circuit(1).catch(x => x);
    await circuit(2).catch(x => x);
    await circuit(3).catch(x => x);
    return expect(circuit(4)).rejects.toEqual("Circuit Breaker Open");
  });
  test("Retries after timeout", async () => {
    const service = () => Promise.reject("no bueno");
    const circuit = CircuitBreaker(
      { ...defaultCircuitBreakerOptions, resetTimeout: 10 },
      service
    );

    await circuit(1).catch(x => x);
    await circuit(2).catch(x => x);
    await circuit(3).catch(x => x);
    await expect(circuit(4)).rejects.toEqual("Circuit Breaker Open");
    await timer(11);
    return expect(circuit(5)).rejects.toEqual("no bueno");
  });
  test("Removes expired errors", async () => {
    const service = () => Promise.reject("no bueno");
    const circuit = CircuitBreaker(
      { ...defaultCircuitBreakerOptions, resetTimeout: 15 },
      service
    );

    await circuit(1).catch(x => x);
    await timer(10);
    await circuit(2).catch(x => x);
    await timer(8);
    await circuit(3).catch(x => x);

    await expect(circuit(4)).rejects.toEqual("no bueno");
  });
});
