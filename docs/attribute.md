# 詳細設定
ルビのスタイル（揃え位置・サイズ・フォント等）に関して詳細設定を行います。`(プロパティ|値)` の形で指定します。  

詳細設定を指定しない場合は既定値が適用されます。明示的に既定値に戻す場合は `base` を値に指定します。

## プロパティ一覧

- align
  - ルビの揃え位置
  - 値：`kata` 肩付き, `naka` 中付き, `jis` JISルール(1-2-1)
  - 既定値：`jis`
  - 記述例：`(align(kata)[肩付[かたつ]き`

- size
  - ルビのサイズ
  - 値：数値 + 単位
  - 規定値：親文字の 1/2 サイズ
  - 記述例：`(font(4H)寸法[すんぽう]`

- font
  - ルビのフォント
  - 値：指定するフォントの PostScript 名
  - 規定値：親文字のフォント
  - 記述例：`(font(KozGoPro-H)小塚[こずか]ゴシック`

- shinshutu
  - ルビが親文字に収まらない場合に、進出処理（前後のアキを調整する）を実施するか
  - 値：

- narrow
  - ルビが親文字に収まらない場合に、水平方向（平体、縦組みでは垂直方向）の縮尺の自動調節を行うか
  - 値：`true` 調節する, `false` 調節しない
  - 既定値：`false`
  - 記述例：`(narrow(false)[標準[デファクト・スタンダード]`

- sutegana

<table align="center">
  <tr>
    <td>概要</td>
    <td>捨て仮名[^1]への自動変換を実施するか</td>
  </tr>
  <tr>
    <td>値</td>
    <td>`true` 変換する, `false` 変換しない</td>
  </tr>
  <tr>
    <td>既定値</td>
    <td>`true`</td>
  </tr>
  <tr>
    <td>記述例</td>
    <td>`(sutegana(true)捨[す]て仮名[がな]`</td>
  </tr>
</table>

- 寸法の指定には以下の単位を指定できます。
  - pt, cm, mm, Q／H, %, px（1px = 0.75pt）

## フォント名の指定
フォントの指定に利用する PostScript 名（PSName）はフォント名やファミリー名とは異なります。例えば、ヒラギノ角ゴProN W3 を使用したい場合は `HiraKakuProN-W6` と記述する必要があります。

PostScript 名 はフォントベンダのサイトや、Adobe Acrobat 等のソフトウェアを用いて確認することが可能です。

- モリサワ：[MORISAWA PASSPORT収録書体名一覧](https://www.morisawa.co.jp/support/download/3697)
- フォントワークス：https://lets-site.jp/burger_editor/burger_editor/dl/32__TEVUUw-D-.pdf
- SCREEN（ヒラギノ）：[PostScriptフォント名一覧](https://www.screen.co.jp/ga_product/sento/support/QA/ss_psname.html)
