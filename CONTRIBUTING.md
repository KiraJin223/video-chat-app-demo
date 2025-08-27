# 🤝 Contributing to Video Chat Application

Thank you for your interest in contributing to our video chat application! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git
- Code editor (VS Code recommended)
- Supabase account (for backend testing)
- Tencent Cloud account (for RTC testing)

### Fork and Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/video-chat-app-demo.git
cd video-chat-app-demo

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/video-chat-app-demo.git
```

### Install Dependencies
```bash
npm install
```

### Environment Setup
```bash
cp env.example .env.local
# Fill in your environment variables
```

### Start Development
```bash
npm start
```

## 🔄 Development Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Follow the coding standards below
- Write tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run the application
npm start

# Run tests (if available)
npm test

# Check linting
npm run lint
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Stay Updated
```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

## 📝 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### React Components
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use proper prop types

### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── utils/         # Utility functions
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
└── constants/     # Application constants
```

### Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive names

### Code Quality
- No console.log in production code
- Handle errors gracefully
- Use semantic HTML
- Ensure accessibility (ARIA labels, keyboard navigation)
- Optimize for performance

## 📤 Submitting Changes

### Pull Request Process

1. **Ensure CI Passes**
   - All tests pass
   - Linting passes
   - Build succeeds

2. **Update Documentation**
   - Update README if needed
   - Add/update code comments
   - Update CHANGELOG if significant

3. **PR Description**
   ```markdown
   ## Description
   Brief description of what this PR does

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Manual testing completed
   - [ ] Cross-browser testing done

   ## Screenshots (if applicable)
   [Add screenshots here]
   ```

4. **Review Process**
   - PRs require at least one review
   - Address feedback promptly
   - Keep PR scope focused

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add Google OAuth integration
fix(video): resolve audio sync issue
docs(readme): update installation instructions
```

## 🐛 Issue Reporting

### Bug Reports
Use the bug report template and include:
- **Environment**: OS, browser, versions
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Additional Context**: Any other relevant information

### Feature Requests
Use the feature request template and include:
- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other approaches considered
- **Use Cases**: Who would benefit from this?

### Priority Labels
- `critical`: Security issues, app crashes
- `high`: Major functionality broken
- `medium`: Minor bugs, enhancements
- `low`: Nice-to-have features

## 🎯 Areas for Contribution

### High Priority
- 🐛 **Bug Fixes** - Check existing issues
- 📱 **Mobile Optimization** - Improve mobile experience
- ♿ **Accessibility** - WCAG compliance improvements
- 🌐 **Internationalization** - Add more languages

### Medium Priority
- 🎨 **UI/UX Improvements** - Better design patterns
- ⚡ **Performance** - Optimization opportunities
- 📊 **Analytics** - Usage tracking implementation
- 🧪 **Testing** - Increase test coverage

### Future Features
- 👥 **Group Calls** - Multi-participant support
- 💬 **Chat Integration** - In-call messaging
- 📺 **Screen Sharing** - Desktop sharing feature
- 🎭 **Virtual Backgrounds** - Background replacement

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Chakra UI](https://chakra-ui.com/)
- [Tencent RTC Documentation](https://trtc.io/)
- [Supabase Documentation](https://supabase.com/docs)

### Tools
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 💬 Getting Help

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Code Reviews** - Tag maintainers for review
- **Discord/Slack** - Real-time community chat (if available)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special recognition for first-time contributors

---

Thank you for contributing to make this project better! Every contribution, no matter how small, is valued and appreciated. 🎉
