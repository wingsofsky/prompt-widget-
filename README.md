# Prompt Widget - 提示词助手windows浮窗

[English](#english) | [中文](#中文)

---

## English

### 📝 Description

Prompt Widget is a lightweight desktop application built with Tauri v2 for managing AI prompts across different platforms (ChatGPT, Claude, Gemini, etc.). Organize your prompts by categories, share them with friends, and discover new ones from the community.

### ✨ Features

- **Category Management**: Organize prompts into categories and subcategories
- **Import/Export**: Share prompts with others via JSON files
- **Built-in Help**: Discover new prompts from recommended communities
- **Default Prompts**: Pre-loaded prompts for:
  - Academic (tutoring, studying)
  - Creative Writing (storytelling, novel writing)
  - Advanced Techniques (jailbreaks for research purposes)
  - Coding assistance
- **Cross-platform**: Windows, macOS, Linux support
- **Lightweight**: Built with Tauri for minimal resource usage

### 🚀 Download

Download the latest version from [Releases](https://github.com/wingsofsky/prompt-widget-/releases):

- **Windows (Recommended)**: `prompt-widget_x64-setup.exe` (NSIS installer)
- **Windows (Alternative)**: `prompt-widget_x64_en-US.msi` (MSI installer)

### 📦 Installation

1. Download the installer for your platform
2. Run the installer
3. Launch Prompt Widget from your applications menu

### 🎯 Usage

1. **Main Window**: Click on any prompt to copy it to clipboard
2. **Settings**: Click the settings icon to manage your prompts
   - Add new categories and prompts
   - Edit existing prompts
   - Delete unwanted items
3. **Import/Export**: Share prompt collections with the community
4. **Help**: Click the help button (?) for community recommendations

### 🌐 Find More Prompts

**Reddit Communities**:
- [r/ChatGPTJailbreak](https://www.reddit.com/r/ChatGPTJailbreak/) - Main jailbreak community
- [r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/) - Prompt engineering techniques
- [r/SillyTavernAI](https://www.reddit.com/r/SillyTavernAI/) - Role-playing and creative writing
- [r/ChatGPTPromptGenius](https://www.reddit.com/r/ChatGPTPromptGenius/) - Curated prompts

**Chinese Platforms**:
- 小红书 (Xiaohongshu) - Search: "AI提示词" / "ChatGPT提示词"
- 知乎 (Zhihu) - Search: "Prompt工程" / "AI指令"
- B站 (Bilibili) - Search: "提示词教程"

### 🛠️ Development

#### Prerequisites

- Node.js 18+
- Rust 1.70+
- Platform-specific dependencies (see [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

#### Build from Source

```bash
# Clone repository
git clone https://github.com/wingsofsky/prompt-widget-.git
cd prompt-widget-

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

### 📄 Tech Stack

- **Frontend**: HTML, CSS (Tailwind), Vanilla JavaScript
- **Backend**: Rust
- **Framework**: Tauri v2
- **Icons**: Lucide Icons
- **Build Tool**: Vite

### ⚠️ Disclaimer

This tool is for educational and productivity purposes. Some included prompts are "jailbreak" techniques intended for:
- Security research
- Understanding AI limitations
- Academic study

Please use responsibly and follow the terms of service of AI platforms.

### 📜 License

This project is open source. Feel free to use, modify, and distribute.

### 🤝 Contributing

Contributions are welcome! Feel free to:
- Submit bug reports
- Suggest new features
- Share your prompt collections
- Improve documentation

---

## 中文

### 📝 项目介绍

Prompt Widget 是一个基于 Tauri v2 开发的轻量级桌面应用，用于管理各种 AI 平台（ChatGPT、Claude、Gemini 等）的提示词。通过分类管理、导入导出等功能，让你的提示词井井有条。

### ✨ 功能特性

- **分类管理**：将提示词按类别和子类别组织
- **导入/导出**：通过 JSON 文件与他人分享提示词
- **内置帮助**：从推荐社区发现新的提示词
- **预设提示词**：内置多种常用提示词：
  - 学术类（辅导学习、考试复习）
  - 故事创作类（小说写作、角色扮演）
  - 高级技巧类（研究用破甲提示词）
  - 代码辅助类
- **跨平台支持**：支持 Windows、macOS、Linux
- **轻量高效**：基于 Tauri，资源占用极低

### 🚀 下载安装

从 [Releases](https://github.com/wingsofsky/prompt-widget-/releases) 下载最新版本：

- **Windows（推荐）**：`prompt-widget_x64-setup.exe`（NSIS 安装包）
- **Windows（备选）**：`prompt-widget_x64_en-US.msi`（MSI 安装包）

### 📦 安装说明

1. 下载适合你系统的安装包
2. 运行安装程序
3. 从应用程序菜单启动 Prompt Widget

### 🎯 使用方法

1. **主窗口**：点击任意提示词即可复制到剪贴板
2. **设置界面**：点击设置图标管理提示词
   - 添加新分类和提示词
   - 编辑现有提示词
   - 删除不需要的项目
3. **导入/导出**：与社区分享提示词合集
4. **帮助页面**：点击帮助按钮（?）查看社区推荐

### 🌐 获取更多提示词

**Reddit 社区**：
- [r/ChatGPTJailbreak](https://www.reddit.com/r/ChatGPTJailbreak/) - 主要破甲社区
- [r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/) - 提示词工程技术
- [r/SillyTavernAI](https://www.reddit.com/r/SillyTavernAI/) - 角色扮演和创作
- [r/ChatGPTPromptGenius](https://www.reddit.com/r/ChatGPTPromptGenius/) - 精选提示词

**国内平台**：
- 小红书 - 搜索："AI提示词" / "ChatGPT提示词"
- 知乎 - 搜索："Prompt工程" / "AI指令"
- B站 - 搜索："提示词教程"

### 🛠️ 开发构建

#### 环境要求

- Node.js 18+
- Rust 1.70+
- 平台相关依赖（参见 [Tauri 前置要求](https://tauri.app/v1/guides/getting-started/prerequisites)）

#### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/wingsofsky/prompt-widget-.git
cd prompt-widget-

# 安装依赖
npm install

# 开发模式运行
npm run tauri dev

# 构建生产版本
npm run tauri build
```

### 📄 技术栈

- **前端**：HTML、CSS（Tailwind）、原生 JavaScript
- **后端**：Rust
- **框架**：Tauri v2
- **图标**：Lucide Icons
- **构建工具**：Vite

### ⚠️ 免责声明

本工具仅用于教育和生产力目的。部分内置的"破甲"提示词仅供以下用途：
- 安全研究
- 理解 AI 限制
- 学术研究

请负责任地使用，并遵守 AI 平台的服务条款。

### 📜 开源许可

本项目开源，欢迎自由使用、修改和分发。

### 🤝 参与贡献

欢迎各种形式的贡献：
- 提交 bug 报告
- 建议新功能
- 分享你的提示词合集
- 改进文档

---

**Made with ❤️ using Tauri**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
