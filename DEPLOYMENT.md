# Prompt Widget 部署指南

[English](#english-deployment-guide) | [中文](#中文部署指南)

---

## 中文部署指南

### 📋 系统要求

**Windows:**
- Windows 10/11
- Node.js 18+ ([下载](https://nodejs.org/))
- Rust 1.70+ ([下载](https://www.rust-lang.org/tools/install))
- WebView2 (Windows 11 自带，Windows 10 需要安装)

**macOS:**
- macOS 10.15+
- Node.js 18+
- Rust 1.70+
- Xcode Command Line Tools

**Linux:**
- Ubuntu 20.04+ / Debian / Fedora / Arch
- Node.js 18+
- Rust 1.70+
- Webkit2GTK 4.1

### 🚀 快速开始

#### 方法一：下载预编译版本（推荐）

1. 访问 [Releases 页面](https://github.com/wingsofsky/prompt-widget-/releases)
2. 下载最新版本的安装包：
   - Windows: `prompt-widget_x64-setup.exe` (推荐) 或 `.msi`
   - macOS: `prompt-widget_x64.dmg`
   - Linux: `prompt-widget_amd64.deb` 或 `.AppImage`
3. 运行安装程序
4. 完成！

#### 方法二：从源码构建

##### 1. 克隆仓库

```bash
git clone https://github.com/wingsofsky/prompt-widget-.git
cd prompt-widget-
```

##### 2. 安装 Node.js 依赖

```bash
npm install
```

##### 3. 安装 Rust（如果未安装）

**Windows:**
```bash
# 访问 https://rustup.rs/ 下载安装器
# 或使用 PowerShell:
winget install Rustlang.Rustup
```

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

##### 4. 开发模式运行

```bash
npm run tauri dev
```

这会启动开发服务器并打开应用。代码修改会自动热重载。

##### 5. 构建生产版本

```bash
npm run tauri build
```

构建产物位置：
- Windows: `src-tauri/target/release/bundle/`
  - NSIS: `nsis/prompt-widget_x.x.x_x64-setup.exe`
  - MSI: `msi/prompt-widget_x.x.x_x64_en-US.msi`
- macOS: `src-tauri/target/release/bundle/dmg/`
- Linux: `src-tauri/target/release/bundle/deb/` 或 `appimage/`

### 🔧 常见问题

#### Q: Windows 上构建失败，提示 "WebView2 not found"

**A:** 安装 WebView2 Runtime:
```bash
# 使用 winget
winget install Microsoft.EdgeWebView2Runtime

# 或从官网下载
# https://developer.microsoft.com/microsoft-edge/webview2/
```

#### Q: Rust 编译错误 "linker `link.exe` not found"

**A:** 安装 Visual Studio Build Tools:
1. 下载 [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
2. 安装时选择 "Desktop development with C++"

#### Q: Linux 上缺少依赖

**A:** 安装系统依赖:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**Fedora:**
```bash
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

**Arch:**
```bash
sudo pacman -S webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  libappindicator-gtk3 \
  librsvg
```

#### Q: npm install 失败

**A:** 尝试以下解决方案:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

#### Q: 构建后的应用打不开

**A:** 检查以下几点:
1. 确保已安装所有运行时依赖（如 WebView2）
2. Windows: 右键属性 → 解除锁定
3. 查看错误日志（通常在 `%APPDATA%` 或 `~/.config` 下）

### 📦 部署到其他电脑

#### 使用安装包（推荐）

1. 将构建好的安装包复制到目标电脑
2. 直接运行安装即可

#### 绿色版（便携版）

1. 构建后，可执行文件在 `src-tauri/target/release/app.exe`
2. 将以下文件夹一起复制：
   ```
   app.exe
   (任何 .dll 依赖文件)
   ```
3. 在目标电脑上确保已安装 WebView2 Runtime

### 🌐 聊天记录功能设置

应用支持管理本地 Markdown 格式的聊天记录：

1. 使用浏览器插件导出 AI 对话为 `.md` 文件
   - 推荐插件：
     - [Chat-Export](https://github.com/Trifall/chat-export)
     - [AI Chat Export to Markdown](https://chromewebstore.google.com/)

2. 按平台组织文件（可选但推荐）：
   ```
   D:\AI_Chats\
   ├── ChatGPT\
   │   ├── 2025-01-19-编程讨论.md
   │   └── 2025-01-18-项目规划.md
   ├── Claude\
   │   └── 2025-01-17-技术咨询.md
   └── Gemini\
       └── 2025-01-16-代码审查.md
   ```

3. 在应用中：
   - 切换到"聊天记录"标签
   - 点击"选择文件夹"
   - 选择你的聊天记录根目录（如 `D:\AI_Chats`）
   - 双击文件使用系统默认程序打开

### 📝 配置文件位置

应用数据存储在：
- **Windows**: `C:\Users\<用户名>\AppData\Roaming\com.promptwidget.app\`
- **macOS**: `~/Library/Application Support/com.promptwidget.app/`
- **Linux**: `~/.config/com.promptwidget.app/`

重要文件：
- `prompts.json` - 提示词数据
- `store.json` - 应用设置（包括聊天记录路径）

---

## English Deployment Guide

### 📋 System Requirements

**Windows:**
- Windows 10/11
- Node.js 18+ ([Download](https://nodejs.org/))
- Rust 1.70+ ([Download](https://www.rust-lang.org/tools/install))
- WebView2 (built-in on Windows 11, install required for Windows 10)

**macOS:**
- macOS 10.15+
- Node.js 18+
- Rust 1.70+
- Xcode Command Line Tools

**Linux:**
- Ubuntu 20.04+ / Debian / Fedora / Arch
- Node.js 18+
- Rust 1.70+
- Webkit2GTK 4.1

### 🚀 Quick Start

#### Method 1: Download Pre-built Binaries (Recommended)

1. Visit [Releases page](https://github.com/wingsofsky/prompt-widget-/releases)
2. Download the latest installer:
   - Windows: `prompt-widget_x64-setup.exe` (recommended) or `.msi`
   - macOS: `prompt-widget_x64.dmg`
   - Linux: `prompt-widget_amd64.deb` or `.AppImage`
3. Run the installer
4. Done!

#### Method 2: Build from Source

##### 1. Clone Repository

```bash
git clone https://github.com/wingsofsky/prompt-widget-.git
cd prompt-widget-
```

##### 2. Install Node.js Dependencies

```bash
npm install
```

##### 3. Install Rust (if not installed)

**Windows:**
```bash
# Visit https://rustup.rs/ to download installer
# Or use PowerShell:
winget install Rustlang.Rustup
```

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

##### 4. Run in Development Mode

```bash
npm run tauri dev
```

This starts the dev server and opens the app. Code changes hot-reload automatically.

##### 5. Build for Production

```bash
npm run tauri build
```

Build outputs:
- Windows: `src-tauri/target/release/bundle/`
  - NSIS: `nsis/prompt-widget_x.x.x_x64-setup.exe`
  - MSI: `msi/prompt-widget_x.x.x_x64_en-US.msi`
- macOS: `src-tauri/target/release/bundle/dmg/`
- Linux: `src-tauri/target/release/bundle/deb/` or `appimage/`

### 🔧 Troubleshooting

#### Q: Build fails on Windows with "WebView2 not found"

**A:** Install WebView2 Runtime:
```bash
# Using winget
winget install Microsoft.EdgeWebView2Runtime

# Or download from official site
# https://developer.microsoft.com/microsoft-edge/webview2/
```

#### Q: Rust compile error "linker `link.exe` not found"

**A:** Install Visual Studio Build Tools:
1. Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
2. Select "Desktop development with C++" during installation

#### Q: Missing dependencies on Linux

**A:** Install system dependencies:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**Fedora:**
```bash
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

**Arch:**
```bash
sudo pacman -S webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  libappindicator-gtk3 \
  librsvg
```

#### Q: npm install fails

**A:** Try these solutions:
```bash
# Clear cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### 📦 Deploy to Another Computer

#### Using Installers (Recommended)

1. Copy the built installer to target computer
2. Run the installer

#### Portable Version

1. After building, executable is at `src-tauri/target/release/app.exe`
2. Copy together with dependencies:
   ```
   app.exe
   (any .dll dependencies)
   ```
3. Ensure WebView2 Runtime is installed on target computer

### 🌐 Chat History Setup

The app supports managing local Markdown chat exports:

1. Export AI conversations to `.md` files using browser extensions:
   - Recommended:
     - [Chat-Export](https://github.com/Trifall/chat-export)
     - [AI Chat Export to Markdown](https://chromewebstore.google.com/)

2. Organize files by platform (optional but recommended):
   ```
   D:\AI_Chats\
   ├── ChatGPT\
   │   ├── 2025-01-19-programming-discussion.md
   │   └── 2025-01-18-project-planning.md
   ├── Claude\
   │   └── 2025-01-17-tech-consultation.md
   └── Gemini\
       └── 2025-01-16-code-review.md
   ```

3. In the app:
   - Switch to "Chat History" tab
   - Click "Select Folder"
   - Choose your chat history root folder (e.g., `D:\AI_Chats`)
   - Double-click files to open with default program

### 📝 Configuration Files

App data is stored at:
- **Windows**: `C:\Users\<username>\AppData\Roaming\com.promptwidget.app\`
- **macOS**: `~/Library/Application Support/com.promptwidget.app/`
- **Linux**: `~/.config/com.promptwidget.app/`

Important files:
- `prompts.json` - Prompt data
- `store.json` - App settings (including chat history path)

---

**Made with ❤️ using Tauri**
