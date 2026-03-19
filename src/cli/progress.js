const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%
  const barChar = "█";
  const barLength = "████████████████████          ".length;

  let progress = 0;
  const intervalId = setInterval(() => {
    if (progress >= 1) {
      process.stdout.write("\r");
    }

    const bar1 = barChar.repeat((barLength * progress) / 100);
    const bar2 = " ".repeat(barLength - bar1.length);

    process.stdout.write(`[${bar1}${bar2}] ${progress}%`);

    if (progress >= 100) {
      clearInterval(intervalId);
      process.stdout.write("\n");
    }

    progress += 1;
  }, 50);
};

progress();
