import { Suite, Event } from "benchmark";
import { Address } from "./src/index";
import testData from "./test/data/formatting.json";

interface EventHandler {
  (event: Event): void;
}

const handler: EventHandler = event => {
  process.stdout.write(String(event.target));
  process.stdout.write("");
};

const suite = new Suite();
suite
  .add("uk-clear-addressing (Current branch)", () => {
    testData.fixtures.forEach(({ fixture }) => {
      const address = new Address(fixture);
      address.formattedAddress();
    });
  })
  .on("cycle", handler)
  .run({ async: true });
