'use strict';
import wdttParse from '../ts/lib/wdtt-parser';
import fs = require('fs');
import assert = require('assert');
import * as iconvLite from 'iconv-lite';
describe(
  'WDTT tests.',
  function () {
    const file = fs.readFileSync(`${__dirname}/fixtures/test.wtt`);
    const wdtt = wdttParse(iconvLite.decode(file, 'SHIFT_JIS'));
    let defaultDestinationData = [{
      destination: '当駅止まり',
      displayText: '止',
    }];

    for (let index = 1; index < 64; index++) {
      const indexText = index.toString().padStart(2, '0');
      defaultDestinationData.push({
        destination: `行先${indexText}`,
        displayText: indexText,
      });
    }

    const defaultColor = '#000000';

    const defaultTrainService = [
      {
        serviceType : '普通', serviceAbbr : '普通',
        timetableColor : defaultColor,
      },
      {
        serviceType : '快速', serviceAbbr : '快速',
        timetableColor : defaultColor,
      },
      {
        serviceType : '特別快速', serviceAbbr : '特快',
        timetableColor : defaultColor,
      },
      {
        serviceType : '新快速', serviceAbbr : '新快',
        timetableColor : defaultColor,
      },
      {
        serviceType : '通勤快速', serviceAbbr : '通快',
        timetableColor : defaultColor,
      },
      {
        serviceType : '準急', serviceAbbr : '準急',
        timetableColor : defaultColor,
      },
      {
        serviceType : '急行', serviceAbbr : '急行',
        timetableColor : defaultColor,
      },
      {
        serviceType : '快速急行', serviceAbbr : '快急',
        timetableColor : defaultColor,
      },
      {
        serviceType : '特急', serviceAbbr : '特急',
        timetableColor : defaultColor,
      },
      {
        serviceType : '快速特急', serviceAbbr : '快特',
        timetableColor : defaultColor,
      },
      {
        serviceType : '通勤準急', serviceAbbr : '通準',
        timetableColor : defaultColor,
      },
      {
        serviceType : '通勤急行', serviceAbbr : '通急',
        timetableColor : defaultColor,
      },
      {
        serviceType : '区間快速', serviceAbbr : '区快',
        timetableColor : defaultColor,
      },
      {
        serviceType : '区間急行', serviceAbbr : '区急',
        timetableColor : defaultColor,
      },
      {
        serviceType : '回送', serviceAbbr : '回送',
        timetableColor : defaultColor,
      },
      {
        serviceType : '貨物', serviceAbbr : '貨物',
        timetableColor : defaultColor,
      },
      {
        serviceType : '急行貨物', serviceAbbr : '急貨',
        timetableColor : defaultColor,
      }
    ];

    const defaultRemarkStyle = {
      boldFlag: false,
      fontFamily: 'ＭＳ ゴシック',
      fontSize: 10,
      italicFlag: false,
    };
    const defaultSubtitleStyle = defaultRemarkStyle;
    const defaultSubtitles = {
      ...{},
      ...defaultSubtitleStyle,
      ...{
        texts: [
          '＊＊鉄道監修',
          '平成00年00月00日改正',
        ],
      }
    };
    const defaultRemarks = {
      ...{},
      ...defaultRemarkStyle,
      ...{
        texts: [],
      },
    };

    const defaultTimetable = {
      cell: {
        destination: {
          boldFlag: false,
          display: true,
          fontFamily: 'ＭＳ ゴシック',
          fontSize: 10,
          italicFlag: false,
          x: 20,
          y: 16,
        },
        height: 32,
        service: {
          boldFlag: false,
          display: true,
          fontFamily: 'ＭＳ ゴシック',
          fontSize: 8,
          italicFlag: false,
          x: 2,
          y: 2,
        },
        time: {
          boldFlag: false,
          fontFamily: 'ＭＳ ゴシック',
          fontSize: 15,
          italicFlag: false,
          x: 2,
          y: 12,
        },
        width: 36,
      },
      header: {
        directionFontStyle: {
          boldFlag: false,
          fontFamily: 'ＭＳ ゴシック',
          fontSize: 14,
          italicFlag: false,
        },
        holidayBackground: '#FF0000',
        holidayColor: '#FFFFFF',
        hourFontStyle: {
          boldFlag: false,
          fontFamily: 'ＭＳ ゴシック',
          fontSize: 18,
          italicFlag: false,
        },
        inboundTitle: '上り（＊＊方面）',
        outboundTitle: '下り（＊＊方面）',
        saturdayBackground: '#0000FF',
        saturdayColor: '#FFFFFF',
        weekdayBackGround: '#000080',
        weekdayColor: '#FFFFFF',
      },
      timetableDefaultDirection: 0,
      title: {
        color: '#000000',
        mainTitle: {
          boldFlag: false,
          fontFamily: 'ＭＳ ゴシック',
          fontSize: 16,
          italicFlag: false,
          text: '＊＊駅列車標準時刻表',
        },      
        subtitles: defaultSubtitles,
      },
      trainsPerHour: 8,
    };

    const minimumData = {
      title: '無題',
      destinations: defaultDestinationData,
      trainService: defaultTrainService,
      timetable: defaultTimetable,
      outboundTrains: [],
      inboundTrains: [],
      remarks: defaultRemarks
    }

    it(
      'Check minimum wdtt file',
      function () {
        assert.deepStrictEqual(wdtt, minimumData, 'Converted data is wrong data.');
      }
    )
  }
);