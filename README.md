## これは何？
駅時刻表の作成ソフト [WinDIATimetable](http://dandp.halfmoon.jp/soft/wdtt.html) で出力される、WDTT 形式のファイルを解析して JavaScript オブジェクトに変換できるパーサです。

## 将来の予定（v3.0.x）
- CommonJS 形式での出力の廃止
  - ES Module のみサポートに変更
- テストフレームワークの Jest への切り替え

## 対応ブラウザ
- ES 2015+ に対応しているブラウザ

## 対応 Node.js バージョン

* 最新の LTS

## 使用方法

WDTT 形式のファイルは Shift_JIS でエンコードされているため、
事前に UTF-8 に文字コードを変換するか、JavaScript のコード内で UTF-8 のテキストに変換する必要があります。

### ブラウザ (ES Modules)

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import wdttParse from './wdtt-parser.js';

    fetch('./test.wtt')
    .then(
      (result) => {
        return result.arrayBuffer();
      }
    ).then(
      (buffer) => {
        // Convert from buffer to utf8 string.
        const sjisDecoder = new TextDecoder('shift_jis');
        const wdttText = sjisDecoder.decode(buffer);
        const wdtt = wdttParse(wdttText);
        console.log(wdtt);
      }
    );
  </script>
</head>
</html>
```

#### Node.js

```js
const wdttParse = require('@tom-konda/wdtt-parser');
const iconvLite = require('iconv-lite');
const fs = require('fs');

const file = fs.readFileSync(`PATH_TO_WDTTFILE/test.wtt`);

// Convert from buffer to utf8 string.
const wdttText = iconvLite.decode(file, 'SHIFT_JIS');
const wdtt = wdttParse(wdttText);
console.log(wdtt);
```


## ライセンス
ライセンスは MIT になります。

## ビルドの仕方

1. `git clone https://github.com/tom-konda/wdtt_parser.git` を実行し、レポジトリをクローンします
2. `cd wdtt_parser` でカレントディレクトリを変更します
3. `npm install` を実行します
4. `npm run build` を実行します