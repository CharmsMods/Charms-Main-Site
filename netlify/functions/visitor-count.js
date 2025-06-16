// netlify/functions/visitor-count.js
import { getStore } from "@netlify/blobs";

export async function handler(event, context) {
  const store = getStore("visitor-count-store");

  // Get current count
  let countStr = await store.get("count");
  let count = countStr ? parseInt(countStr) : 0;

  // Increment and store updated count
  count++;
  await store.set("count", count.toString());

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count })
  };
}
