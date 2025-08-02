# Contributing to AuthHub

Thank you for your interest in contributing to AuthHub! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. Check if the issue has already been reported
2. Use the appropriate issue template
3. Provide detailed information including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)
   - Screenshots if applicable

### Feature Requests

We welcome feature requests! Please:

1. Describe the feature clearly
2. Explain why it would be useful
3. Provide examples if possible
4. Consider implementation complexity

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the coding standards below
4. **Test your changes** thoroughly
5. **Commit your changes**: `git commit -m 'feat: add your feature description'`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Create a Pull Request** with a clear description

## 📝 Code Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### React Components

- Use functional components with hooks
- Follow the naming convention: `PascalCase` for components
- Use TypeScript interfaces for props
- Keep components focused and reusable

### CSS/Styling

- Use **Tailwind CSS** for styling
- Follow utility-first approach
- Use CSS custom properties for theming
- Ensure responsive design

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🧪 Testing

- Write tests for new features
- Ensure all existing tests pass
- Use descriptive test names
- Test both success and error cases

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments for new functions
- Update API documentation
- Include examples for new features

## 🔧 Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see README.md)
4. Start development server: `npm run dev`
5. Run tests: `npm test` (when available)

## 🚀 Release Process

1. Ensure all tests pass
2. Update version in `package.json`
3. Update CHANGELOG.md
4. Create a release tag
5. Deploy to production

## 📞 Getting Help

If you need help with contributing:

- Check existing issues and discussions
- Join our community (if available)
- Contact maintainers directly

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to AuthHub! 🎉 