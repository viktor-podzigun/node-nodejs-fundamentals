import { parentPort } from "worker_threads";

if (!parentPort) {
  throw Error();
}

// Receive array from main thread
// Sort in ascending order
// Send back to main thread

parentPort.on("message", () => {
  // Write your code here
});
