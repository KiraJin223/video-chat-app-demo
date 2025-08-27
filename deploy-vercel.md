# 🚀 Vercel 部署指南

## 📋 部署前准备

✅ **项目构建完成** - `npm run build` 已成功执行  
✅ **Vercel配置** - `vercel.json` 已创建  
✅ **环境变量** - 已配置 Supabase 和 Tencent Cloud 密钥  

## 🔧 部署步骤

### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 部署项目
```bash
vercel --prod
```

### 4. 设置环境变量
在 Vercel 仪表板中设置以下环境变量：

#### Supabase 配置
- `REACT_APP_SUPABASE_URL` = `https://vkxajrlobifkfqxwlbcm.supabase.co`
- `REACT_APP_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZreGFqcmxvYmlma2ZxeHdsYmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2OTQ0NDksImV4cCI6MjA3MTI3MDQ0OX0.y-07nMReGgi0UxDP5GVvK3VZ6WNFjdLcVLTdE7NpqYs`

#### Tencent Cloud 配置
- `REACT_APP_TENCENT_SDKAPPID` = `20026685`

## 🌐 部署后配置

### 1. 域名设置
- 自动生成: `your-project.vercel.app`
- 自定义域名: 可在 Vercel 仪表板中配置

### 2. 环境变量验证
确保所有环境变量在 Vercel 仪表板中正确设置

### 3. 功能测试
- 用户注册/登录
- 视频通话功能
- Supabase 连接

## ⚠️ 重要注意事项

1. **环境变量安全**: 不要在代码中硬编码敏感信息
2. **CORS 配置**: Supabase 需要允许 Vercel 域名
3. **视频通话**: 确保 TUICallKit 在生产环境中正常工作
4. **监控**: 使用 Vercel Analytics 监控应用性能

## 🔍 故障排除

### 常见问题
- **环境变量未设置**: 检查 Vercel 仪表板中的环境变量
- **构建失败**: 确保所有依赖都已安装
- **API 错误**: 验证 Supabase 和 Tencent Cloud 配置

### 支持资源
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 部署指南](https://supabase.com/docs/guides/deployment)
- [TUICallKit 生产环境配置](https://www.tencentcloud.com/document/product/647/41940)

## 🎯 部署完成检查清单

- [ ] 项目成功构建
- [ ] Vercel 部署完成
- [ ] 环境变量设置正确
- [ ] 域名可访问
- [ ] 用户认证功能正常
- [ ] 视频通话功能正常
- [ ] 错误监控配置完成

---

**部署完成后，你的视频聊天应用将在 Vercel 上运行，支持全球用户访问！** 🎉
