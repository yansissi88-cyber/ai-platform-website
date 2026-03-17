# 🎬 KeyReply Kira 视频制作指南

## 📦 交付文件清单

本项目包含以下视频制作相关文件：

| 文件 | 说明 |
|-----|------|
| `video-script.md` | 60秒分镜脚本（时间轴+口播语） |
| `voice-over.md` | 口播语完整版本（3种风格） |
| `video-demo.html` | 可录制的产品演示动画 |
| `Module-Video-Generator-Mar-8-23-03-17_92cf19.mp4` | 您的原始视频（需审阅） |

---

## 🚀 快速开始（3步制作视频）

### 第1步：准备录制环境

```bash
# 1. 启动本地服务器
npx serve . -p 3000

# 2. 浏览器访问 http://localhost:3000/video-demo.html

# 3. 设置窗口大小为 1920x1080
```

**浏览器设置：**
- Chrome/Edge 全屏模式（F11）
- 缩放比例：100%
- 分辨率：1920x1080

---

### 第2步：录制视频

#### 方案A：使用 OBS Studio（免费）

1. **下载安装**：[obsproject.com](https://obsproject.com)

2. **设置场景**：
   ```
   来源 → 窗口采集 → 选择 video-demo.html 浏览器窗口
   ```

3. **输出设置**：
   ```
   设置 → 输出 → 
   - 视频比特率: 8000 Kbps
   - 编码器: NVENC (NVIDIA) 或 x264
   - 录制格式: MP4
   ```

4. **视频设置**：
   ```
   设置 → 视频 →
   - 基础分辨率: 1920x1080
   - 输出分辨率: 1920x1080
   - 常用FPS值: 60
   ```

5. **开始录制**：
   - 点击 video-demo.html 中的 "🔴 开始录制" 按钮
   - OBS 开始录制
   - 演示会自动播放7个场景（共60秒）
   - 录制完成后按 "停止录制"

#### 方案B：使用 Screen Studio（Mac）

```bash
# 安装
brew install --cask screen-studio

# 使用
1. 打开 Screen Studio
2. 选择录制浏览器窗口
3. 设置 1920x1080, 60fps
4. 启用"平滑缩放"和"光标隐藏"
5. 开始录制
```

#### 方案C：使用 Camtasia（专业编辑）

适合需要后期编辑的场景：
- 添加转场效果
- 插入额外素材
- 配音同步

---

### 第3步：后期制作

#### 添加口播语

**录制设备建议**：
- 麦克风：Blue Yeti / Rode NT-USB
- 录音环境：安静房间，避免回声

**Audacity 处理流程**：
1. 录制口播语（按脚本）
2. 降噪（Effect → Noise Reduction）
3. 归一化（Effect → Normalize）
4. 压缩（Effect → Compressor）
5. 导出为 WAV/MP3

**同步到视频**：
- 使用 DaVinci Resolve（免费）或 Premiere Pro
- 按场景切割，对齐口播语

#### 添加背景音乐

**推荐音乐库**：
- Epidemic Sound（商业授权）
- Artlist（订阅制）
- YouTube Audio Library（免费）

**音乐风格**：电子/科技，120-128 BPM

**音量平衡**：
- 口播语：-12 dB
- 背景音乐：-24 dB（不要盖过人声）

---

## 📝 口播语时间轴（精确版）

| 时间码 | 场景 | 口播语 |
|-------|------|--------|
| 00:00 | Hook | 你的客户，还在等待？ |
| 00:03 | Hook | 每一秒的延迟，都是流失的风险。 |
| 00:05 | 产品 | KeyReply Kira —— AI-Native 客户互动平台。 |
| 00:12 | Voice AI | Voice AI，300毫秒响应，像真人一样自然。 |
| 00:22 | Agent | 无需编程，拖拽创建 AI 坐席。55种技能，12种模板。 |
| 00:32 | 多渠道 | 电话、WhatsApp、邮件...14个渠道，一个平台。 |
| 00:42 | 架构 | 基于 Cloudflare 边缘网络，275节点，全球覆盖。 |
| 00:52 | CTA | 99.99%可用性。数百万次日对话。 |
| 00:58 | CTA | KeyReply Kira —— 让每一次对话都更有价值。 |

---

## 🎨 视觉风格规范

### 配色方案

```css
--bg-primary: #020204       /* 深黑背景 */
--accent-blue: #3b82f6      /* 科技蓝 */
--accent-purple: #8b5cf6    /* 紫罗兰 */
--accent-pink: #ec4899      /* 粉色 */
--accent-green: #10b981     /* 成功绿 */
```

### 动画节奏

| 元素 | 时长 | 缓动 |
|-----|------|------|
| 场景切换 | 0.5s | ease-out |
| 卡片出现 | 0.4s | ease-out |
| 波形动画 | 1s | ease-in-out |
| 呼吸效果 | 2s | ease-in-out |

---

## 📹 上传到网站

### 选项1：上传到视频平台（推荐）

**YouTube**：
1. 上传视频到 YouTube
2. 设置为"不公开"或"公开"
3. 复制嵌入代码
4. 粘贴到网站视频区域

**Vimeo**（更专业）：
1. 上传视频
2. 自定义播放器颜色（匹配品牌）
3. 获取嵌入链接

### 选项2：自托管

```bash
# 上传到网站服务器
# 视频文件放在 /videos/ 目录

# 修改 index.html 中的视频链接
<video src="videos/kira-demo.mp4" controls></video>
```

### 选项3：使用现有演示页面

直接链接到 `video-demo.html`：
```html
<a href="video-demo.html" target="_blank">
  观看交互式演示
</a>
```

---

## ✅ 质量检查清单

### 技术检查
- [ ] 分辨率：1920x1080
- [ ] 帧率：60fps
- [ ] 时长：60秒（±2秒）
- [ ] 格式：MP4 (H.264)
- [ ] 文件大小：< 100MB

### 内容检查
- [ ] Logo 清晰可见
- [ ] 口播语与画面同步
- [ ] 文字无错别字
- [ ] 动画流畅无卡顿
- [ ] 背景音乐音量适中

### 品牌检查
- [ ] 配色符合品牌规范
- [ ] 使用了正确的 Logo
- [ ] 网址正确显示
- [ ] CTA 按钮醒目

---

## 🆘 常见问题

### Q1: 录制时动画不同步？
**解决**：确保浏览器帧率稳定，关闭其他程序

### Q2: 视频文件太大？
**解决**：使用 HandBrake 压缩，或降低比特率到 5000 Kbps

### Q3: 口播语录不好？
**解决**：分段录制，每幕单独录，后期拼接

### Q4: 需要添加字幕？
**解决**：使用剪映/Arctime，导入 `voice-over.md` 脚本

---

## 📞 技术支持

如有问题，请参考：
- OBS 教程：[obsproject.com/wiki](https://obsproject.com/wiki)
- DaVinci Resolve：[blackmagicdesign.com](https://www.blackmagicdesign.com/products/davinciresolve)

---

*最后更新: 2026-03-08*  
*版本: v1.0*
