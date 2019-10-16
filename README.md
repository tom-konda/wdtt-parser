## これは何？
駅時刻表の作成ソフト [WinDIATimetable](http://dandp.halfmoon.jp/soft/wdtt.html) で出力される、WDTT 形式のファイルを解析して JavaScript
オブジェクトに変換できるパーサです。

## 対応ブラウザ
- ES 2015+ に対応しているブラウザ

## 対応 Node.js バージョン

* 最新の LTS

## 使用方法

### ブラウザ (ES Modules)

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import wdttParse from './wdtt-parser.js';

    fetch('./test.wdtt')
    .then(
      (result) => {
        return result.text();
      }
    ).then(
      (wdttText) => {
        const wdtt = wdttParse(wdttText);
      }
    );
  </script>
</head>
</html>
```

#### Node.js

```js
const wdttParse = require('@tom-konda/wdtt-parse');

const file = fs.readFileSync(`PATH_TO_WDTTFILE/test.wdtt`);

// Convert from buffer to string
const wdttText = file.toString();
const wdtt = wdttParse(wdttText);
```


## ライセンス
ライセンスは MIT になります。

## ビルドの仕方

1. `git clone https://github.com/tom-konda/wdtt_parser.git` を実行し、レポジトリをクローンします
2. `cd wdtt_parser` でカレントディレクトリを変更します
3. `npm install` を実行します
4. `npm run build` を実行します