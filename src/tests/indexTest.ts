'use strict';
import {wdttParse} from '../ts/lib/wdtt-parser';
import fs = require('fs');
import assert = require('assert');
import * as iconvLite from 'iconv-lite';
import {getDefaultWdtt} from './getDefaultWdtt';

describe(
  'Minimum WDTT tests.',
   () => {
    const file = fs.readFileSync(`${__dirname}/fixtures/test.wtt`);
    const wdtt = wdttParse(iconvLite.decode(file, 'SHIFT_JIS'));

    const minimumData = getDefaultWdtt();

    it(
      'Check minimum wdtt file',
      () => {
        assert.deepStrictEqual(wdtt, minimumData, 'Converted data is wrong data.');
      }
    )
  }
);

describe(
  'WDTT tests.',
  () => {
    let wdtt2: wdttDefaultJSON;
    before(
      () => {
        const file = fs.readFileSync(`${__dirname}/fixtures/test2.wtt`);
        wdtt2 = wdttParse(iconvLite.decode(file, 'SHIFT_JIS'));
      }
    );

    it(
      'Check remark.',
      () => {

        const remarkTextExpect =
`テスト凡例
　,
止 …当駅止まり
下1…下り行先01行
下2…下り行先02行`;

        const expectInboundRemarkContent =
`縦書き
縦書き`
        const expectInboundRemark: remarkText = {
          isInbound: true,
          x: 15,
          y: 150,
          isVertical: true,
          textColor: '#FF0000',
          content: expectInboundRemarkContent,
        }

        assert.deepStrictEqual(wdtt2.remarks.texts[0].content, remarkTextExpect, 'Converted data is wrong data.');
        assert.deepStrictEqual(wdtt2.remarks.texts[wdtt2.remarks.texts.length - 1], expectInboundRemark);
      }
    )

    it(
      'Check outbound trains data.',
      () => {
        const expectedFirstOutboundTrain: trainData = {
          serviceType: 14,
          trainID: '9901',
          trainServiceName: '',
          trainServiceNumber: null,
          departureTime: '540',
          destination: 1,
          operationDatePattern: 9,
        }
        assert.deepStrictEqual(wdtt2.outboundTrains[0], expectedFirstOutboundTrain, 'Converted outbound train is wrong data.');
        
        const expectedLastOutboundTrain: trainData = {
          serviceType: 0,
          trainID: '111',
          trainServiceName: '',
          trainServiceNumber: null,
          departureTime: '020',
          destination: 0,
          operationDatePattern: 4,
        }
        assert.deepStrictEqual(wdtt2.outboundTrains[wdtt2.outboundTrains.length - 1], expectedLastOutboundTrain, 'Converted outbound train is wrong data.');
      }
    );

    it(
      'Check inbound trains data.',
      () => {
        const expectedLastInboundTrain: trainData = {
          serviceType: 0,
          trainID: '110',
          trainServiceName: '',
          trainServiceNumber: null,
          departureTime: '2359',
          destination: 0,
          operationDatePattern: 0,
        }
        assert.deepStrictEqual(wdtt2.inboundTrains[wdtt2.inboundTrains.length - 1], expectedLastInboundTrain, 'Converted inbound train is wrong data.');

        const expectedNamedInboundTrain: trainData = {
          serviceType: 8,
          trainID: '3002',
          trainServiceName: '朝路',
          trainServiceNumber: 1,
          departureTime: '638',
          destination: 3,
          operationDatePattern: 2,
        }
        assert.deepStrictEqual(wdtt2.inboundTrains[3], expectedNamedInboundTrain);
      }
    );

    it(
      'Check font settings.',
      () => {
        const mainTitleActualConfig = wdtt2.timetable.title.mainTitle;
        delete mainTitleActualConfig.text;
        assert.deepStrictEqual(
          mainTitleActualConfig as fontStyle,
          {isBold: true, isItalic: true, fontSize: 22, fontFamily: '游ゴシック'},
          'Converted main title font settings is wrong.'
        );
        const remarkActualConfig = Object.assign({}, wdtt2.remarks);
        delete remarkActualConfig.texts;
        assert.deepStrictEqual(
          remarkActualConfig as fontStyle,
          {isBold: false, isItalic: false, fontSize: 14, fontFamily: 'ＭＳ ゴシック'},
          'Converted remark font settings is wrong.'
        );
        const hourActualConfig = wdtt2.timetable.header.hourFontStyle;
        assert.deepStrictEqual(
          hourActualConfig,
          {isBold: false, isItalic: true, fontSize: 24, fontFamily: 'Noto Mono'},
          'Converted hour font settings is wrong.'
        );
        const cellActualConfig = Object.assign({}, wdtt2.timetable.cell.time);
        delete cellActualConfig.x;
        delete cellActualConfig.y;
        assert.deepStrictEqual(
          cellActualConfig as fontStyle,
          {isBold: true, isItalic: false, fontSize: 20, fontFamily: '游ゴシック'}
        )
      }
    )
  }
);