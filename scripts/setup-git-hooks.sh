#!/bin/bash

# Setup Git hooks for automatic type checking before commits

echo "Setting up Git pre-commit hook..."

# Create the pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Run TypeScript type checking
echo "📝 Checking TypeScript types..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript type check failed. Please fix the errors before committing."
  exit 1
fi

# Run ESLint
echo "🔧 Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint check failed. Please fix the linting errors before committing."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git pre-commit hook installed successfully!"
echo ""
echo "Now TypeScript and ESLint will run automatically before every commit."
echo "If there are any errors, the commit will be blocked until you fix them."
echo ""
echo "To test it, try running: npm run pre-commit"