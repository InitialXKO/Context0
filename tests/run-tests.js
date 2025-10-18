async function run() {
  const suites = [
    ["Integration", require("./integration.test").runIntegrationTests],
    ["End-to-End", require("./e2e.test").runE2eTests],
  ];

  for (const [name, runner] of suites) {
    if (typeof runner !== "function") {
      throw new Error(`Test suite ${name} is missing an executable function`);
    }

    await runner();
    console.log(`✔ ${name} suite passed`);
  }

  console.log("All Context0 automated tests passed successfully");
}

run().catch((error) => {
  console.error("Test suite failed", error);
  process.exitCode = 1;
});
