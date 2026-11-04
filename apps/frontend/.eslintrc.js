module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier', // Add prettier to ESLint configuration
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      // Allow CommonJS module syntax in these files
      files: ['tailwind.config.js', 'postcss.config.js', '*.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-commonjs': 'off',
      },
    },
  ],
};
