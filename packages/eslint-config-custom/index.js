module.exports = {
  extends: ['next', 'turbo', 'plugin:react/recommended', 'plugin:prettier/recommended', 'prettier'],
  rules: {
    'import/no-anonymous-default-export': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        props: 'never',
        children: 'never',
      },
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'linebreak-style': ['error', 'unix'],
  },
};
