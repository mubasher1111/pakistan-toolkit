# Contributing

Shukriya for helping! Contributions of all sizes are welcome.

## Easy first contributions

- **Add a missing bank:** add a row to `banks` in [`src/data.js`](src/data.js) with its 4-letter IBAN code.
- **Add a city:** add a row to `cities` in [`src/data.js`](src/data.js) with its Urdu name and province code.
- **New tax year:** when a new Finance Act is passed, add the year to `TAX_SLABS` in [`src/tax.js`](src/tax.js). Link the official source in your PR.

After editing data, regenerate the JSON files:

```bash
npm run build:data
```

## Development

```bash
npm test
```

- Keep the package **zero-dependency**.
- Add a test for every new function or bug fix.
- If you add or change a public function, update `index.d.ts` and the README.

## Accuracy

This library is used for real forms and payroll, so correctness matters more than speed. Please include a source (FBR, SBP, PTA, the bank's own website) for any data or tax change.
