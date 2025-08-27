# ⚡ Quick Start Guide

Get the video chat application running in under 5 minutes!

## 🎯 One-Command Setup

```bash
# Clone and setup in one go
git clone https://github.com/your-username/video-chat-app-demo.git && \
cd video-chat-app-demo && \
npm install && \
cp env.example .env.local && \
echo "✅ Setup complete! Edit .env.local with your keys, then run 'npm start'"
```

## 🔑 Environment Variables

Edit `.env.local` with your credentials:

```env
# Supabase (Required)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Tencent RTC (Required)
REACT_APP_TENCENT_SDKAPPID=your-sdk-app-id
```

### 🆓 Getting Free Credentials

#### Supabase (Free tier: 500MB database, 5GB bandwidth)
1. Visit [supabase.com](https://supabase.com)
2. Create account → New Project
3. Copy URL and anon key from Settings → API

#### Tencent RTC (Free tier: 10,000 minutes/month)
1. Visit [trtc.io](https://trtc.io)
2. Register → Console → Create Application
3. Copy SDKAppID from application info

## 🚀 Launch

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing Video Calls

1. **Create Account** - Register with email
2. **Get Your ID** - Note your Call User ID (8 characters)
3. **Open Second Window** - Use incognito mode
4. **Register Again** - Different email for second user
5. **Start Call** - Enter first user's Call User ID

## 🔧 Troubleshooting

### Common Issues

**Port 3000 already in use?**
```bash
PORT=3001 npm start
```

**Environment variables not working?**
- Restart the development server after editing `.env.local`
- Check variable names match exactly (including `REACT_APP_` prefix)

**Supabase connection failed?**
- Verify URL format: `https://xxxxx.supabase.co`
- Check anon key is copied completely

**Video call not working?**
- Ensure both users are on the same network or have public internet
- Check browser permissions for camera/microphone
- Try Chrome/Firefox for best compatibility

### 🆘 Need Help?

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/your-username/video-chat-app-demo/issues)
- 💬 [Discussions](https://github.com/your-username/video-chat-app-demo/discussions)

## 🎉 Next Steps

- ⭐ Star the repository if you find it useful
- 🍴 Fork it to customize for your needs
- 🔄 Contribute improvements
- 📢 Share with others

---

**Live Demo**: [video-chat-app-demo-2pwt9k0g7-kirajin132580-2360s-projects.vercel.app](https://video-chat-app-demo-2pwt9k0g7-kirajin132580-2360s-projects.vercel.app)
