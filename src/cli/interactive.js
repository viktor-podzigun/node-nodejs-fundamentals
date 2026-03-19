import readline from "readline";

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    "Please, enter one of the following commands: uptime, cwd, date, exit",
  );

  /** @type {(onAnswer: (answer: string) => void) => void} */
  function prompt(onAnswer) {
    rl.question("> ", (answer) => {
      onAnswer(answer);
    });
  }

  /** @type {(answer: string) => void} */
  const handler = (answer) => {
    switch (answer) {
      case "uptime":
        console.log(`${Math.floor(process.uptime())} seconds`);
        prompt(handler);
        break;

      case "cwd":
        console.log(process.cwd());
        prompt(handler);
        break;

      case "date":
        console.log(new Date());
        prompt(handler);
        break;

      case "exit":
        rl.close();
        break;

      default:
        console.log("Unsupported command!");
        prompt(handler);
        break;
    }
  };

  prompt(handler);
};

interactive();
