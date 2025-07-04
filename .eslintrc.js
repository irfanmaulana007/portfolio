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
};
