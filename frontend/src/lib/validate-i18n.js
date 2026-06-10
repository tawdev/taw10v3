const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, 'src/translations');

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
    } else {
      keys.push(`${prefix}${key}`);
    }
  }
  return keys;
}

function validateTranslations() {
  const languages = ['fr', 'en', 'ar'];
  const files = fs.readdirSync(path.join(TRANSLATIONS_DIR, 'fr'));
  
  files.forEach(file => {
    const frContent = JSON.parse(fs.readFileSync(path.join(TRANSLATIONS_DIR, 'fr', file), 'utf8'));
    const frKeys = getKeys(frContent);
    
    languages.filter(l => l !== 'fr').forEach(lang => {
      const filePath = path.join(TRANSLATIONS_DIR, lang, file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing file: ${filePath}`);
        return;
      }
      
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const keys = getKeys(content);
      
      const missingKeys = frKeys.filter(k => !keys.includes(k));
      const extraKeys = keys.filter(k => !frKeys.includes(k));
      
      if (missingKeys.length > 0) {
        console.error(`❌ Missing keys in ${lang}/${file}:`, missingKeys);
      }
      if (extraKeys.length > 0) {
        console.error(`⚠️ Extra keys in ${lang}/${file}:`, extraKeys);
      }
      
      if (missingKeys.length === 0 && extraKeys.length === 0) {
        process.stdout.write(`✅ ${lang}/${file} is in sync\n`);
      }
    });
  });
}

validateTranslations();
