# 🎥 Video Chat Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen)](https://video-chat-app-demo-2pwt9k0g7-kirajin132580-2360s-projects.vercel.app)
[![React](https://img.shields.io/badge/React-17.0.2-blue)](https://reactjs.org/)
[![Tencent RTC](https://img.shields.io/badge/Tencent%20RTC-4.0.8-purple)](https://trtc.io/)
[![Supabase](https://img.shields.io/badge/Supabase-2.56.0-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)

[🇬🇧 English](#english) | [🇨🇳 中文](#中文)

---

## English

A modern real-time video chat application built with React and powered by Tencent RTC, featuring secure authentication and high-quality video calling capabilities.

### ✨ Features

- **🎯 Real-time Video Calling** - High-quality 1v1 video calls with ultra-low latency
- **🔐 Secure Authentication** - User registration and login system powered by Supabase
- **📱 Responsive Design** - Modern UI that works seamlessly across all devices
- **🚀 Production Ready** - Deployed on Vercel with global CDN
- **⚡ Modern Tech Stack** - Built with React 17, TypeScript, and Chakra UI
- **🌐 Tencent RTC Integration** - Professional-grade real-time communication

### 🛠️ Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | Frontend Framework | 17.0.2 |
| **TypeScript** | Type Safety | 4.9.5 |
| **Tencent RTC** | Video Calling Engine | 4.0.8 |
| **Supabase** | Authentication & Backend | 2.56.0 |
| **Chakra UI** | UI Component Library | 1.8.9 |
| **Vercel** | Deployment Platform | Latest |

### 🚀 Quick Start

#### Prerequisites

- Node.js 16+ and npm
- Supabase account
- Tencent Cloud account with RTC service

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/video-chat-app-demo.git
   cd video-chat-app-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_TENCENT_SDKAPPID=your-tencent-sdk-app-id
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### 📖 How to Use

1. **Create Account** - Register with your email address
2. **Get User ID** - Your unique Call User ID will be generated
3. **Start Calling** - Share your ID with friends to receive calls
4. **Enjoy** - Experience high-quality video communication

### 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── SignIn.tsx       # Login page
│   ├── SignUp.tsx       # Registration page
│   └── VideoChat.tsx    # Main video chat interface
├── utils/               # Utility functions
│   ├── supabase.ts      # Supabase client
│   ├── userSigService.ts # UserSig generation
│   └── userIdConverter.ts # ID conversion utilities
├── debug/               # Development tools
└── App.tsx              # Main application component
```

### 🌐 Deployment

This project is deployed on Vercel with automatic CI/CD:

- **Live Demo**: [https://video-chat-app-demo-2pwt9k0g7-kirajin132580-2360s-projects.vercel.app](https://video-chat-app-demo-2pwt9k0g7-kirajin132580-2360s-projects.vercel.app)
- **Build Status**: ✅ Successfully deployed
- **Edge Functions**: Supabase integration for secure UserSig generation

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is open source and available under the [MIT License](LICENSE).

### 🙏 Acknowledgments

- [Tencent RTC](https://trtc.io/) for providing excellent real-time communication services
- [Supabase](https://supabase.com/) for backend infrastructure
- [Chakra UI](https://chakra-ui.com/) for beautiful UI components
- [Vercel](https://vercel.com/) for seamless deployment

---

## 中文

一个基于 React 构建的现代实时视频聊天应用，由腾讯 RTC 提供技术支持，具备安全认证和高质量视频通话功能。

### ✨ 功能特性

- **🎯 实时视频通话** - 超低延迟的高质量1v1视频通话
- **🔐 安全认证** - 基于 Supabase 的用户注册和登录系统
- **📱 响应式设计** - 现代化UI，完美适配各种设备
- **🚀 生产就绪** - 部署在 Vercel 上，支持全球 CDN
- **⚡ 现代技术栈** - 使用 React 17、TypeScript 和 Chakra UI 构建
- **🌐 腾讯 RTC 集成** - 专业级实时通信技术

### 🛠️ 技术栈

| 技术 | 用途 | 版本 |
|-----|------|------|
| **React** | 前端框架 | 17.0.2 |
| **TypeScript** | 类型安全 | 4.9.5 |
| **腾讯 RTC** | 视频通话引擎 | 4.0.8 |
| **Supabase** | 认证和后端 | 2.56.0 |
| **Chakra UI** | UI 组件库 | 1.8.9 |
| **Vercel** | 部署平台 | 最新版 |

### 🚀 快速开始

#### 环境要求

- Node.js 16+ 和 npm
- Supabase 账户
- 腾讯云账户（开通 RTC 服务）

#### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/video-chat-app-demo.git
   cd video-chat-app-demo
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   ```bash
   cp env.example .env.local
   ```
   
   填入你的环境变量：
   ```env
   REACT_APP_SUPABASE_URL=你的-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=你的-supabase-anon-key
   REACT_APP_TENCENT_SDKAPPID=你的-腾讯-sdk-app-id
   ```

4. **启动开发服务器**
   ```bash
   npm start
   ```

5. **打开浏览器**
   访问 `http://localhost:3000`

### 📖 使用方法

1. **创建账户** - 使用邮箱地址注册
2. **获取用户ID** - 系统会生成你的专属 Call User ID
3. **开始通话** - 与朋友分享你的ID来接收通话
4. **享受体验** - 体验高质量的视频通信

### 🏗️ 项目结构

```
src/
├── components/           # React 组件
│   ├── SignIn.tsx       # 登录页面
│   ├── SignUp.tsx       # 注册页面
│   └── VideoChat.tsx    # 主要视频聊天界面
├── utils/               # 工具函数
│   ├── supabase.ts      # Supabase 客户端
│   ├── userSigService.ts # UserSig 生成
│   └── userIdConverter.ts # ID 转换工具
├── debug/               # 开发工具
└── App.tsx              # 主应用组件
```

### 🌐 部署

本项目部署在 Vercel 上，支持自动 CI/CD：

- **在线演示**: [https://video-chat-app-demo-2pwt9k0g7-kirajin132580-2360s-projects.vercel.app](https://video-chat-app-demo-2pwt9k0g7-kirajin132580-2360s-projects.vercel.app)
- **构建状态**: ✅ 部署成功
- **边缘函数**: Supabase 集成，安全生成 UserSig

### 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 这个项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 📄 许可证

本项目是开源的，使用 [MIT 许可证](LICENSE)。

### 🙏 致谢

- [腾讯 RTC](https://trtc.io/) 提供优秀的实时通信服务
- [Supabase](https://supabase.com/) 提供后端基础设施
- [Chakra UI](https://chakra-ui.com/) 提供美观的UI组件
- [Vercel](https://vercel.com/) 提供无缝部署体验

---

<div align="center">

Made with ❤️ by developers, powered by [Tencent RTC](https://trtc.io/)

[Live Demo](https://video-chat-app-demo-2pwt9k0g7-kirajin132580-2360s-projects.vercel.app) • [Report Bug](https://github.com/your-username/video-chat-app-demo/issues) • [Request Feature](https://github.com/your-username/video-chat-app-demo/issues)

</div>