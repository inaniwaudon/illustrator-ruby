# Contribution
## Development
TypeScript で記述され、Webpack + ts-loader を用いて ES3 相当のスクリプトに変更しています[^es3]。  

Babel が出力するソースコードを Illustrator のインタプリタが解釈できないため、必要に応じて Polyfill を `./src/polyfill.ts` に手動で記述しています。

```bash
yarn  # Install dependencies
yarn dev # Develop
yarn build  # Build
```

## References
- [Adobe Illustrator 2022 Scripting Reference: JavaScript](https://developer.adobe.com/console/servicesandapis)
- [Requirements for Japanese Text Layout
日本語組版処理の要件（日本語版）](https://www.w3.org/TR/jlreq/)

[^es3]: Adobe Illustrator に搭載されているインタプリタは、ECMAScript 3 に相当する JavaScript を解釈します。
