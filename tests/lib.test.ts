'use strict';
import {wdttParse} from '../src/ts/lib/wdtt-parser';
import { readFileSync } from 'fs';
import { decode } from 'iconv-lite';
import {getDefaultWdtt} from './getDefaultWdtt';
import { describe, it, expect, beforeEach } from 'vitest';

describe(
  'Minimum WDTT tests.',
  () => {
    const file = readFileSync(`${__dirname}/fixtures/test.wtt`);
    const wdtt = wdttParse(decode(file, 'SHIFT_JIS'));

    const minimumData = getDefaultWdtt();

    it(
      'Check minimum wdtt file',
      () => {
        expect(wdtt).toStrictEqual(minimumData);
      }
    )
  }
);

describe(
  'WDTT tests.',
  () => {
    let wdtt2: wdttDefaultJSON;
    beforeEach(
      () => {
        const file = readFileSync(`${__dirname}/fixtures/test2.wtt`);
        wdtt2 = wdttParse(decode(file, 'SHIFT_JIS'));
      }
    );

    it(
      'Check remark.',
      () => {

        /*eslint no-irregular-whitespace: ['error', { 'skipTemplates': true }]*/
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

        expect(wdtt2.remarks.texts[0].content).toEqual(remarkTextExpect);
        expect(wdtt2.remarks.texts[wdtt2.remarks.texts.length - 1]).toStrictEqual(expectInboundRemark);
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
          operationDate: 9,
        }
        expect(wdtt2.outboundTrains[0]).toStrictEqual(expectedFirstOutboundTrain);

        const expectedLastOutboundTrain: trainData = {
          serviceType: 0,
          trainID: '111',
          trainServiceName: '',
          trainServiceNumber: null,
          departureTime: '020',
          destination: 0,
          operationDate: 4,
        }
        expect(wdtt2.outboundTrains[wdtt2.outboundTrains.length - 1]).toStrictEqual(expectedLastOutboundTrain);
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
          operationDate: 0,
        }
        expect(wdtt2.inboundTrains[wdtt2.inboundTrains.length - 1]).toStrictEqual(expectedLastInboundTrain);

        const expectedNamedInboundTrain: trainData = {
          serviceType: 8,
          trainID: '3002',
          trainServiceName: '朝路',
          trainServiceNumber: 1,
          departureTime: '638',
          destination: 3,
          operationDate: 2,
        }
        expect(wdtt2.inboundTrains[3]).toStrictEqual(expectedNamedInboundTrain);
      }
    );

    it(
      'Check font settings.',
      () => {
        const mainTitleActualConfig = wdtt2.timetable.titles.mainTitle as Partial<fontStyleMergedType<{text: string;}>>;
        delete mainTitleActualConfig.text;
        expect(mainTitleActualConfig).toStrictEqual({isBold: true, isItalic: true, fontSize: 22, fontFamily: '游ゴシック'});
        const remarkActualConfig = Object.assign({}, wdtt2.remarks) as Partial<fontStyleMergedType<{texts: remarkText[];}>>;
        delete remarkActualConfig.texts;
        expect(remarkActualConfig).toStrictEqual({isBold: false, isItalic: false, fontSize: 14, fontFamily: 'ＭＳ ゴシック'});
        const hourActualConfig = wdtt2.timetable.header.hourFontStyle;
        expect(hourActualConfig).toStrictEqual({isBold: false, isItalic: true, fontSize: 24, fontFamily: 'Noto Mono'});
        const cellActualConfig = Object.assign({}, wdtt2.timetable.cell.time) as Partial<fontStyleMergedType<coordinate>>;
        delete cellActualConfig.x;
        delete cellActualConfig.y;
        expect(cellActualConfig).toStrictEqual({isBold: true, isItalic: false, fontSize: 20, fontFamily: '游ゴシック'});
      }
    )
  }
);

describe(
  'Version 1.05 WDTT tests.',
  () => {
    it(
      'Check minimum wdtt file',
      () => {
        const file = readFileSync(`${__dirname}/fixtures/test_v105.wtt`);
        const wdtt = wdttParse(decode(file, 'SHIFT_JIS'));
        expect(wdtt.title).toStrictEqual('無題');
      }
    );

    it(
      'Check wdtt file',
      () => {
        const file = readFileSync(`${__dirname}/fixtures/test2_v105.wtt`);
        const wdtt = wdttParse(decode(file, 'SHIFT_JIS'));
        expect(wdtt.destinations[60].displayText).toStrictEqual('還暦');
      }
    );
  }
);
