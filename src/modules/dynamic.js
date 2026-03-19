/**
 * @typedef {{
 *  run(): string;
 * }} PluginInterface
 */

const dynamic = async () => {
  // Write your code here
  // Accept plugin name as CLI argument
  // Dynamically import plugin from plugins/ directory
  // Call run() function and print result
  // Handle missing plugin case

  if (process.argv.length < 3) {
    console.log("Please, specify plugin name via cli argument");
    return;
  }

  const pluginName = process.argv[2];
  const pluginScript = `./plugins/${pluginName}.js`;

  /** @type {PluginInterface} */
  const plugin = await (async () => {
    try {
      return await import(pluginScript);
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        console.error(`Plugin script not found: ${pluginScript}`);
        process.exit(1);
      }

      throw error;
    }
  })();

  const result = plugin.run();
  console.log(result);
};

await dynamic();
