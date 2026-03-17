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
  
  await new Promise(r => setTimeout(r, 3000));
  
  // 获取所有图片URL
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height
    }));
  });
  
  // 获取所有背景图片
  const bgImages = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const bgUrls = [];
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundImage;
      if (bg && bg !== 'none' && bg.includes('url')) {
        bgUrls.push(bg);
      }
    });
    return bgUrls;
  });
  
  console.log('Images:', JSON.stringify(images, null, 2));
  console.log('Background Images:', JSON.stringify(bgImages, null, 2));
  
  // 获取所有section的结构
  const sections = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section')).map((sec, i) => ({
      index: i,
      className: sec.className,
      id: sec.id,
      textContent: sec.textContent.substring(0, 200)
    }));
  });
  
  console.log('Sections:', JSON.stringify(sections, null, 2));
  
  await browser.close();
})();
