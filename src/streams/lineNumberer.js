import LineNumberTransformer from "./LineNumberTransformer.js";

const lineNumberer = () => {
  // Write your code here
  // Read from process.stdin
  // Use Transform Stream to prepend line numbers
  // Write to process.stdout

  const tr = new LineNumberTransformer();
  process.stdin.pipe(tr).pipe(process.stdout);
};

lineNumberer();
