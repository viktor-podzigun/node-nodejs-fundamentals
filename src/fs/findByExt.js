import findByExtImpl from "./findByExtImpl.js";

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)

  /** @type {readonly string[]} */
  const args = process.argv;
  const defaultExt = ".txt";
  const extensions = new Set([defaultExt]);

  if (args.length > 2) {
    const arg1 = args[2];
    if (arg1.trim() === "--ext" && args.length > 3) {
      const arg2 = args[3];

      extensions.clear();
      arg2.split(",").forEach((_) => {
        const ext = _.trim();
        extensions.add(ext.startsWith(".") ? ext : `.${ext}`);
      });

      if (extensions.size === 0) {
        extensions.add(defaultExt);
      }
    }
  }
  // console.log(`${Array.from(extensions).join(",")}`)

  const files = await findByExtImpl(extensions);

  files.forEach(console.log);
};

await findByExt();
