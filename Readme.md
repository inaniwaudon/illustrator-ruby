# illustrator-ruby

Adobe Illustrator 上でルビ（振りがな）を振るためのスクリプトです。

Illustrator は標準ではルビ機能に対応していませんが、本スクリプトを使用することで、テキストベースの指定によって一括でルビを振ることが可能となります。

[サンプル](./docs/sample.md) - [詳細設定](./docs/attribute.md) - [FAQ](./docs/faq.md)

[解説記事](https://) - スクリプトの使用方法や、ルビの基本に関して解説しています。

## 主な仕様
- ポイントテキスト、エリア内テキストに対して、縦組・横組いずれの場合もルビを振ることができます。
- パス上テキストは横組みのみ対応しています。この際、ルビは水平に配置されます（パスに沿ってルビが回転することはありません）。
- スレッドテキスト、パス上テキスト（縦組み）には対応していません。
- ルビは親文字のテキストフレームとは別に新たなポイントテキストとして配置され、グループ化された状態で生成されます。
- Adobe Illustrator 2022 (26.3.1) で動作確認をしています。

## 使用方法
### ルビの記述
`[親文字|ルビ]` の形で記述します。  
`[親文字|ルビ1/ルビ2/...]` と記述した場合は、物ルビとして `ルビ1` が親文字の 1 文字目に対応します。
`[親文字|上側ルビ|下側ルビ]` と記述した場合は、上側・下側の両サイドにルビを付与します。

```
# モノルビ（2つの処理結果は同一）
[筑|つく][波|ば][大|だい][学|がく][情|じょう][報|ほう][学|がく][群|ぐん]
[筑波大学|つく|ば|だい|がく][情報学群|じょう|ほう|がく|ぐん]

# グループルビ
[筑波|つくば][大学|だいがく][情報|じょうほう][学群|がくぐん]
[筑波大学|つくばだいがく][情報学群|じょうほうがくぐん]
```

### 詳細設定
ルビのスタイル（揃え位置・サイズ・フォント等）に関して詳細設定を行います。`(プロパティ|値)` の形で指定します。  

指定可能なプロパティに関しては、[詳細設定](./docs/attribute.md) を参照ください。

### スクリプトの実行
1. 2つのテキストフレームを用意します。
2. 片方のテキストに対して、先述した記法を用いてルビや詳細設定を指定します。
3. 2 で編集したルビを指示するテキストを、`base` を含む名前にリネームします。
4. もう一方の、ルビを振るテキストを、`finish` を含む名前にリネームします。
5. 2 つのテキストフレームを選択します。
6. Illustrator 上で `dist/ruby.jsx` を実行します。
  - `dist/ruby.jsx` ファイルをワークスペース内にドラッグ・アンド・ドロップすることでスクリプトが実行されます。


## 注意事項
- MIT ライセンスに従って、自由に使用・再配布等を行うことができます。
- 本スクリプトは無保証です。本スクリプトの仕様を原因とする損失や損害に関して、一切の責任を負いかねます。


## Contribution
### Development
TypeScript で記述され、Webpack + ts-loader を用いて ES3 相当のスクリプトに変更しています[^es3]。  
Babel が出力するソースコードを Illustrator のインタプリタが解釈できないため、必要に応じて Polyfill を `./src/polyfill.ts` に手動で記述しています。

```bash
yarn  # Install dependencies
yarn dev # Develop
yarn build  # Build
```


## License
Copyright (c) 2022 いなにわうどん.
This software is released under the MIT License, see LICENSE.

[^es3]: Adobe Illustrator に搭載されているインタプリタは、ECMAScript 3 に相当する JavaScript を解釈します。
