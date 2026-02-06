const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('https://nj2mffjrkocdy.ok.kimi.link/', { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });
  
  // 等待页面加载完成
  await new Promise(r => setTimeout(r, 3000));
  
  // 截图全页
  await page.screenshot({ 
    path: '/Users/sissi/ai-platform-website/reference-screenshot.png',
    fullPage: true 
  });
  
  console.log('截图已保存到 reference-screenshot.png');
  
  // 获取页面 HTML 内容
  const html = await page.content();
  require('fs').writeFileSync('/Users/sissi/ai-platform-website/reference-page.html', html);
  console.log('HTML 已保存');
  
  // 获取页面样式信息
  const styles = await page.evaluate(() => {
    const allStyles = [];
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules) {
          allStyles.push(rule.cssText);
        }
      } catch(e) {}
    }
    return allStyles.join('\n');
  });
  require('fs').writeFileSync('/Users/sissi/ai-platform-website/reference-styles.css', styles);
  console.log('样式已保存');
  
  await browser.close();
})();
