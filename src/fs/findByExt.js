import findByExtImpl from "./findByExtImpl.js";

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)
  const files = await findByExtImpl(process.argv, ".");
  files.forEach(console.log);
};

await findByExt();
