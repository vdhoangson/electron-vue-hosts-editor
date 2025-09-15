const sudo = require("sudo-prompt");
const fs = require("fs");
const os = require("os");
const path = require("path");

const options = { name: "HostsEditor" };

function getHostsFilePath() {
  if (os.platform() === "win32") {
    return "C:\\Windows\\System32\\drivers\\etc\\hosts";
  }
  return "/etc/hosts";
}

function readHostsFile() {
  return fs.readFileSync(getHostsFilePath(), "utf-8");
}

function writeHostsFile(content) {
  return new Promise((resolve, reject) => {
    const filePath = getHostsFilePath();

    if (os.platform() === "win32") {
      // Use a temporary file approach for Windows to avoid PowerShell quoting issues
      const tempFile = path.join(os.tmpdir(), `hosts_temp_${Date.now()}.txt`);

      try {
        // Write content to temp file first
        fs.writeFileSync(tempFile, content, "utf-8");

        // Use PowerShell to copy from temp file to hosts file
        const cmd = `powershell -Command "Copy-Item '${tempFile}' '${filePath}' -Force"`;

        sudo.exec(cmd, options, (error) => {
          // Clean up temp file
          try {
            fs.unlinkSync(tempFile);
          } catch (cleanupError) {
            console.warn("Failed to cleanup temp file:", cleanupError);
          }

          if (error) return reject(error);
          resolve();
        });
      } catch (fsError) {
        reject(fsError);
      }
    } else {
      // For Unix-like systems, use the original approach but with better escaping
      const safeContent = content.replace(/'/g, "'\"'\"'");
      const cmd = `echo '${safeContent}' | tee ${filePath}`;

      sudo.exec(cmd, options, (error) => {
        if (error) return reject(error);
        resolve();
      });
    }
  });
}

module.exports = { readHostsFile, writeHostsFile };
