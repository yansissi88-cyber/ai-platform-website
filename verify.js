const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:3456', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  await new Promise(r => setTimeout(r, 5000));
  
  await page.screenshot({ 
    path: '/Users/sissi/ai-platform-website/react_site.png',
    fullPage: true 
  });
  
  console.log('截图已保存');
  await browser.close();
})();
