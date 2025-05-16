import fs from 'fs';
import path from 'path';

export function logToFile(message: string) {
  const now = new Date();
  const dateFormat = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, `api-${dateFormat}.log`);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Rotasi: hapus log yang lebih dari 7 hari
  fs.readdir(logDir, (err, files) => {
    if (err) {
      console.error('[Logger] Failed to read log directory:', err);
      return;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    files.forEach(file => {
      const match = file.match(/^api-(\d{4})-(\d{2})-(\d{2})\.log$/);
      if (match) {
        const [_, year, month, day] = match;
        const fileDate = new Date(`${year}-${month}-${day}`);
        if (fileDate < sevenDaysAgo) {
          const filePath = path.join(logDir, file);
          fs.unlink(filePath, err => {
            if (err) console.error('[Logger] Failed to delete old log file:', err);
          });
        }
      }
    });
  });

  fs.appendFile(logFile, `${message}\n`, (err) => {
    if (err) console.error('[Logger] Failed to write log:', err);
  });
}
