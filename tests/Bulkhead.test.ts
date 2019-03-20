import { Bulkhead, defaultBulkheadOptions } from "../src/Common/Bulkhead";
import { timer } from "./helpers";

describe("Bulkhead", () => {
  test("Passes through service success", () => {
    const service = () => Promise.resolve("we good");
    const bulkhead = Bulkhead(defaultBulkheadOptions, service);

    return expect(bulkhead(1)).resolves.toEqual("we good");
  });
  test("Passes through service failures", () => {
    const service = () => Promise.reject("no bueno");
    const bulkhead = Bulkhead(defaultBulkheadOptions, service);

    return expect(bulkhead(1)).rejects.toEqual("no bueno");
  });
  test("Passes through multiple service failures and successes", async () => {
    let flip = true;
    const service = () => {
      flip = !flip;
      return flip ? Promise.resolve("we good") : Promise.reject("no bueno");
    };
    const bulkhead = Bulkhead(defaultBulkheadOptions, service);

    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
    await expect(bulkhead(1)).rejects.toEqual("no bueno");
    await expect(bulkhead(1)).resolves.toEqual("we good");
  });
  test("1 Paralleism restricts to 1 request", async () => {
    const service = ({ message, time }: { message: string; time: number }) =>
      timer(time).then(() => message);
    const bulkhead = Bulkhead({ parallelism: 1 }, service);

    await expect(
      Promise.race([
        bulkhead({ message: "s1", time: 10 }),
        bulkhead({ message: "s2", time: 5 }),
        bulkhead({ message: "s3", time: 2 })
      ])
    ).resolves.toEqual("s1");
  });
  test("2 Paralleism restricts to 2 request", async () => {
    const service = ({ message, time }: { message: string; time: number }) =>
      timer(time).then(() => message);
    const bulkhead = Bulkhead({ parallelism: 2 }, service);

    await expect(
      Promise.race([
        bulkhead({ message: "s1", time: 10 }),
        bulkhead({ message: "s2", time: 5 }),
        bulkhead({ message: "s3", time: 2 })
      ])
    ).resolves.toEqual("s2");
  });
});
