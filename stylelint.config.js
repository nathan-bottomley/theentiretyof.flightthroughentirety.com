export default {
  extends: [
    'stylelint-config-recess-order',
    'stylelint-config-standard'
  ],
  rules: {
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'lightness-notation': 'number',
    'custom-property-pattern': null
  }
}
