module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Disable the no-explicit-any rule completely
    '@typescript-eslint/no-explicit-any': 'off',
    // Fix unescaped entities
    'react/no-unescaped-entities': ['error', { forbid: ['>', '"', "'"] }],
    // Prevent console statements in production code
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
};
