#!/usr/bin/env node

const DEFAULT_BASE_URL = process.env.MEASURE_BASE_URL || "http://127.0.0.1:3000";
const DEFAULT_RUNS = Number.parseInt(process.env.MEASURE_RUNS || "20", 10);
const DEFAULT_WARMUP = Number.parseInt(process.env.MEASURE_WARMUP || "3", 10);

function parseArgs(argv) {
  const args = { baseUrl: DEFAULT_BASE_URL, runs: DEFAULT_RUNS, warmup: DEFAULT_WARMUP };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--base-url" && argv[i + 1]) {
      args.baseUrl = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === "--runs" && argv[i + 1]) {
      const parsed = Number.parseInt(argv[i + 1], 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        args.runs = parsed;
      }
      i += 1;
      continue;
    }

    if (arg === "--warmup" && argv[i + 1]) {
      const parsed = Number.parseInt(argv[i + 1], 10);
      if (Number.isFinite(parsed) && parsed >= 0) {
        args.warmup = parsed;
      }
      i += 1;
      continue;
    }
  }

  return args;
}

function formatMs(value) {
  return `${value.toFixed(2)} ms`;
}

function percentile(sortedValues, percentileValue) {
  if (sortedValues.length === 0) {
    return 0;
  }

  const index = Math.ceil((percentileValue / 100) * sortedValues.length) - 1;
  const clampedIndex = Math.max(0, Math.min(sortedValues.length - 1, index));
  return sortedValues[clampedIndex];
}

function summarize(times) {
  const sorted = [...times].sort((a, b) => a - b);
  const total = times.reduce((sum, value) => sum + value, 0);
  const average = total / times.length;

  return {
    average,
    min: sorted[0] ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
    p50: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    p99: percentile(sorted, 99)
  };
}

async function measureEndpoint(baseUrl, endpoint, runs, warmup) {
  const url = `${baseUrl}${endpoint.path}`;
  const timings = [];
  const statusCounts = new Map();

  const makeRequest = async () => {
    const start = performance.now();
    let status = "ERR";

    try {
      const response = await fetch(url, {
        method: endpoint.method,
        headers: endpoint.headers,
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
      });

      status = String(response.status);
      await response.arrayBuffer();
    } catch {
      status = "ERR";
    }

    const elapsed = performance.now() - start;
    return { elapsed, status };
  };

  for (let i = 0; i < warmup; i += 1) {
    await makeRequest();
  }

  for (let i = 0; i < runs; i += 1) {
    const { elapsed, status } = await makeRequest();
    timings.push(elapsed);
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
  }

  return {
    name: endpoint.name,
    method: endpoint.method,
    path: endpoint.path,
    summary: summarize(timings),
    statusCounts
  };
}

function printStatusCounts(statusCounts) {
  const parts = [...statusCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([status, count]) => `${status}:${count}`);

  return parts.join(", ");
}

async function main() {
  const { baseUrl, runs, warmup } = parseArgs(process.argv);

  const endpoints = [
    {
      name: "Home",
      method: "GET",
      path: "/",
      headers: undefined,
      body: undefined
    },
    {
      name: "Assistant API",
      method: "POST",
      path: "/api/assistant",
      headers: { "content-type": "application/json" },
      body: {
        prompt: "health check",
        projectSlug: "ai-agent-portfolio-platform"
      }
    },
    {
      name: "AI API",
      method: "POST",
      path: "/api/ai",
      headers: { "content-type": "application/json" },
      body: {
        message: "health check"
      }
    },
    {
      name: "Contact API validation path",
      method: "POST",
      path: "/api/contact",
      headers: { "content-type": "application/json" },
      body: {
        name: "Latency Test",
        email: "invalid",
        message: "latency probe"
      }
    }
  ];

  console.log(`Base URL: ${baseUrl}`);
  console.log(`Runs per endpoint: ${runs}`);
  console.log(`Warmup requests per endpoint: ${warmup}`);
  console.log("");

  for (const endpoint of endpoints) {
    const result = await measureEndpoint(baseUrl, endpoint, runs, warmup);
    const { summary } = result;

    console.log(`${result.name} (${result.method} ${result.path})`);
    console.log(`  avg: ${formatMs(summary.average)}`);
    console.log(`  min: ${formatMs(summary.min)}`);
    console.log(`  p50: ${formatMs(summary.p50)}`);
    console.log(`  p95: ${formatMs(summary.p95)}`);
    console.log(`  p99: ${formatMs(summary.p99)}`);
    console.log(`  max: ${formatMs(summary.max)}`);
    console.log(`  statuses: ${printStatusCounts(result.statusCounts)}`);
    console.log("");
  }
}

main().catch((error) => {
  console.error("Failed to measure response times:", error);
  process.exit(1);
});
