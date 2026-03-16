/**
 * @param {readonly string[]} processArgs
 * @param {string} argName
 * @param {string} [valueSep]
 * @returns {readonly string[]}
 */
export function parseArgs(processArgs, argName, valueSep = ",") {
  /** @type {string[]} */
  const values = [];

  if (processArgs.length > 2) {
    const arg1 = processArgs[2];

    if (arg1.trim() === argName && processArgs.length > 3) {
      const arg2 = processArgs[3];

      arg2.split(valueSep).forEach((_) => values.push(_));
    }
  }

  return values;
}
