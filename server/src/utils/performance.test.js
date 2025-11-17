/**
 * Performance test utilities for AI services
 */

export const measureExecutionTime = async (
  asyncFunction,
  label = "Operation"
) => {
  const startTime = performance.now();
  try {
    const result = await asyncFunction();
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.log(`⏱️ ${label}: ${executionTime.toFixed(2)}ms`);
    return { result, executionTime };
  } catch (error) {
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    console.log(`❌ ${label} failed after: ${executionTime.toFixed(2)}ms`);
    throw error;
  }
};

export const testSubmitWritingPerformance = async (sampleData) => {
  console.log("🚀 Testing submitWriting performance...");

  const testData = {
    userId: "test-user-001",
    prompt:
      "Write a formal email to your club manager about a recent announcement",
    part: 4,
    content: `Dear Sir/Madam,

My name is John Smith, and I have been a member of the Photography Club since January 2023.

I am writing regarding your letter about the new meeting schedule changes. 

I think this is a great opportunity for all members to participate more actively. However, I felt that the proposed timing might conflict with many members' work schedules.

In my opinion, we should consider having weekend sessions as an alternative. This would allow more members to attend and contribute to our club activities.

I hope that my suggestions are useful for the club's development.

Sincerely,
John Smith`,
    metadata: {
      typeEmail: 1,
      taskId: "task-001",
    },
    ...sampleData,
  };

  try {
    const { result, executionTime } = await measureExecutionTime(
      () =>
        import("../controllers/Ai.controller.js").then((controller) =>
          controller.default.submitWriting(
            { body: testData },
            {
              status: () => ({ json: () => {} }),
              json: () => {},
            }
          )
        ),
      "Complete submitWriting flow"
    );

    console.log("✅ Performance test completed");
    console.log(`📊 Total execution time: ${executionTime.toFixed(2)}ms`);

    if (executionTime > 10000) {
      console.log(
        "⚠️ Performance warning: Operation took more than 10 seconds"
      );
    } else if (executionTime > 5000) {
      console.log(
        "⚡ Good performance: Operation completed in reasonable time"
      );
    } else {
      console.log("🚀 Excellent performance: Very fast execution");
    }
  } catch (error) {
    console.error("❌ Performance test failed:", error.message);
  }
};

export const benchmarkParallelVsSequential = async () => {
  console.log("🔄 Benchmarking parallel vs sequential processing...");

  const tasks = [
    () => new Promise((resolve) => setTimeout(() => resolve("Task 1"), 1000)),
    () => new Promise((resolve) => setTimeout(() => resolve("Task 2"), 1500)),
    () => new Promise((resolve) => setTimeout(() => resolve("Task 3"), 800)),
  ];

  // Test sequential execution
  const { executionTime: sequentialTime } = await measureExecutionTime(
    async () => {
      const results = [];
      for (const task of tasks) {
        results.push(await task());
      }
      return results;
    },
    "Sequential execution"
  );

  // Test parallel execution
  const { executionTime: parallelTime } = await measureExecutionTime(
    async () => {
      const results = await Promise.all(tasks.map((task) => task()));
      return results;
    },
    "Parallel execution"
  );

  const improvement = (
    ((sequentialTime - parallelTime) / sequentialTime) *
    100
  ).toFixed(1);
  console.log(
    `📈 Performance improvement: ${improvement}% faster with parallel processing`
  );

  return { sequentialTime, parallelTime, improvement };
};

// Run performance tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🧪 Running performance tests...\n");

  benchmarkParallelVsSequential()
    .then(() => {
      console.log("\n✨ Performance tests completed!");
    })
    .catch((error) => {
      console.error("💥 Performance test error:", error);
    });
}
