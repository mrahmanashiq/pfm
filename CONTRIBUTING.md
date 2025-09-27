# Contributing to PFM - Personal Finance Manager

First off, thank you for considering contributing to PFM! It's people like you that make PFM such a great tool for personal finance management.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what behavior you expected**
* **Include screenshots if possible**
* **Include your environment details** (OS, Java version, Node.js version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the Java and TypeScript style guides
* Include thoughtfully-worded, well-structured tests
* Document new code based on the Documentation Style Guide
* End all files with a newline

## Development Process

### Setup Development Environment

1. **Fork and clone the repository**
```bash
git clone https://github.com/your-username/pfm.git
cd pfm
```

2. **Set up the backend**
```bash
# Install Java 17 if not already installed
# Set up MySQL database
# Copy and configure application.properties
./gradlew bootRun
```

3. **Set up the frontend**
```bash
cd pfm-client
npm install
npm start
```

### Making Changes

1. **Create a branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
```bash
# Backend tests
./gradlew test

# Frontend tests
cd pfm-client
npm test
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add new feature" # Use conventional commits
```

5. **Push and create a Pull Request**
```bash
git push origin feature/your-feature-name
```

## Style Guides

### Git Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org/):

* `feat:` new feature
* `fix:` bug fix
* `docs:` documentation changes
* `style:` formatting, missing semicolons, etc.
* `refactor:` code refactoring
* `test:` adding tests
* `chore:` maintenance tasks

Examples:
```
feat: add transaction categorization
fix: resolve JWT token expiration issue
docs: update API documentation
```

### Java Style Guide

* Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
* Use meaningful variable and method names
* Add JavaDoc comments for public methods
* Keep methods small and focused
* Use proper exception handling

### TypeScript/React Style Guide

* Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* Use TypeScript for type safety
* Use functional components with hooks
* Keep components small and focused
* Use meaningful prop and state names

### Database Guidelines

* Use snake_case for table and column names
* Add proper indexes for frequently queried columns
* Include migration scripts for schema changes
* Write efficient queries

## Testing Guidelines

### Backend Testing

* Write unit tests for all service methods
* Write integration tests for controllers
* Test both success and error scenarios
* Use meaningful test names

```java
@Test
void shouldCreateAccountSuccessfully() {
    // Test implementation
}

@Test
void shouldThrowExceptionWhenAccountNotFound() {
    // Test implementation
}
```

### Frontend Testing

* Write unit tests for utility functions
* Write component tests for UI logic
* Test user interactions
* Test error states

```typescript
describe('AccountForm', () => {
  it('should submit form with valid data', () => {
    // Test implementation
  });

  it('should show validation errors for invalid data', () => {
    // Test implementation
  });
});
```

## Documentation

* Update README.md for new features
* Add inline code comments for complex logic
* Update API documentation
* Include examples in documentation

## Release Process

1. **Version Bumping**
   - Follow [Semantic Versioning](https://semver.org/)
   - Update version in `build.gradle` and `package.json`

2. **Changelog**
   - Update CHANGELOG.md with new features and fixes
   - Group changes by type (Added, Changed, Fixed, Removed)

3. **Testing**
   - Run full test suite
   - Test in different environments
   - Perform manual testing of key features

## Questions?

Feel free to ask questions by:
* Creating an issue with the "question" label
* Starting a discussion in GitHub Discussions
* Reaching out to maintainers directly

Thank you for contributing! 🎉