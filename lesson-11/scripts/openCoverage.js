const { exec } = require("child_process");
const path = require("path");

// абсолютний шлях до coverage/index.html
const coverageFile = path.join(__dirname, "..", "coverage", "lcov-report", "index.html");

// Команда для Windows
const command = `start "" "${coverageFile.replace(/\\/g, "\\\\")}"`;

exec(command, (err) => {
  if (err) {
    console.error("Failed to open coverage:", err);
  } else {
    console.log("📊 Coverage opened:", coverageFile);
  }
});
