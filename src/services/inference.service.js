const path = require('path');
const { spawn } = require('child_process');

/**
 * Runs the Python inference script and parses its JSON output.
 *
 * @param {string} videoPath - Absolute path to the uploaded video file.
 * @returns {Promise<{prediction: string, confidence: number}>}
 */
function runInference(videoPath) {
  return new Promise((resolve, reject) => {
    // On Windows, `python` can sometimes resolve to a stub.
    // Default to a known working Python if PYTHON_PATH isn't set.
    const pythonPath =
      process.env.PYTHON_PATH ||
      'C:\\Users\\menal\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';

    const scriptPath = path.resolve(__dirname, '../../python/predict.py');

    let stdout = '';
    let stderr = '';

    const child = spawn(pythonPath, [scriptPath, videoPath], {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });

    const timeoutMs = Number(process.env.PYTHON_INFERENCE_TIMEOUT_MS || 300000); // 5 min
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error('Python inference timed out'));
    }, timeoutMs);

    child.on('error', (err) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });

    child.on('close', (code) => {
      clearTimeout(timeout);

      if (code !== 0) {
        const compactStdout = stdout.trim().slice(0, 2000);
        const compactStderr = stderr.trim().slice(0, 2000);
        return reject(
          new Error(
            `Python process failed with exit code ${code}. Stderr: ${compactStderr || '(empty)'} Stdout: ${compactStdout || '(empty)'}`
          )
        );
      }

      try {
        // Be tolerant: if Python prints extra logs, pick the JSON block.
        const start = stdout.indexOf('{');
        const end = stdout.lastIndexOf('}');
        if (start === -1 || end === -1 || end < start) {
          throw new Error('No JSON object found in Python stdout');
        }

        const jsonText = stdout.slice(start, end + 1);
        const parsed = JSON.parse(jsonText);
        resolve(parsed);
      } catch (e) {
        reject(
          new Error(
            `Invalid JSON from Python: ${e.message}. Stdout: ${stdout.trim().slice(0, 2000)}`
          )
        );
      }
    });
  });
}

module.exports = {
  runInference,
};

