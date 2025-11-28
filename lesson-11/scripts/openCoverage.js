const { exec } = require("child_process");
const path = require("path");

const coverageFile = path.join(
  __dirname,
  "..",
  "coverage",
  "lcov-report",
  "index.html",
);

const command = `start "" "${coverageFile.replace(/\\/g, "\\\\")}"`;

exec(command, (err) => {
  if (err) {
    console.error("Failed to open coverage:", err);
  } else {
    console.log("Coverage opened:", coverageFile);
  }
});
