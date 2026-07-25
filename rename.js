import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const folders = ['.'];
folders.forEach(folder => {
  walk(folder, filePath => {
    if (filePath.includes('node_modules') || filePath.includes('dist') || filePath.includes('.git') || filePath.endsWith('.png') || filePath.endsWith('.log') || filePath === 'rename.js' || filePath.includes('.npmrc') || filePath.includes('package-lock.json')) return;
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let newContent = content
        .replace(/BBoard/g, 'Invoice')
        .replace(/bboard/g, 'invoice')
        .replace(/BBOARD/g, 'INVOICE');
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated ' + filePath);
      }
    } catch (e) {
      // ignore
    }
  });
});
