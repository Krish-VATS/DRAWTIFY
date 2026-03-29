const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'packages/excalidraw/locales');

function processObj(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/Excalidraw/g, 'Drawtify').replace(/excalidraw/g, 'drawtify');
  } else if (Array.isArray(obj)) {
    return obj.map(processObj);
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      // Don't change keys, only values, to prevent breaking t('...') calls
      newObj[key] = processObj(obj[key]);
    }
    return newObj;
  }
  return obj;
}

try {
  const files = fs.readdirSync(localesDir);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(localesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const json = JSON.parse(content);
        const updated = processObj(json);
        fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n');
      } catch (e) {
        console.error(`Error parsing ${file}:`, e);
      }
    }
  }
  console.log('Locales updated successfully.');
} catch (e) {
  console.error(e);
}
