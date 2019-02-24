const wdttParse = (() => {
  const getSectionText = (str = '', start:string, end = '') => {
    let regexp: RegExp;
    if (end.length) {
      regexp = new RegExp(`\\[${start}\\]\\s+([\\s\\S]+)\\s+\\[${end}`);
    }
    else {
      regexp = new RegExp(`\\[${start}\\]\\s+([\\s\\S]+)$`);
    }
    const match = str.match(regexp)
    return match === null ? '' : match[1].trim();
  
  }

  return (wtt = '') : wdttDefaultJSON => {
    wtt = wtt.replace(/\r/g, '');
    const title = getSectionText(wtt, 'WinDIATimeTable', '表示');
    const [timetableTitleText, timetableValidDate, timetableSupervisor, timetableOutboundTitle, timetableInboundTitle, timetableStyle, cellStyle, colorStyle, ...fontStyle] = getSectionText(wtt, '表示', '凡例').split('\n');
    const [timetableDefaultDirection, trainsPerHour] = timetableStyle.split(',').map(Number);
    const [cellWidth, cellHeight, cellTimePosX, cellTimePosY, cellTrainServicePosX, cellTrainServicePosY, destinationPosX, destinationPosY, trainServiceDisplayFlag, destinationDisplayFlag] = cellStyle.split(',').map(Number);
    const [titleColor, weekdayColor, weekdayBackGround, saturdayColor, saturdayBackground, holidayColor, holidayBackground] = colorStyle.split(',');
    const [titleFontStyle, remarkFontStyle, headerDirectionFontStyle, headerHourFontStyle, cellTimeFontStyle, cellTrainServiceFontStyle, cellTrainDestinationFontStyle, subtitleFontStyle] = fontStyle.map(styles => {
      const [fontFamily, fontSize, italicFlag, boldFlag] = styles.split(',');
      return {fontFamily, fontSize: Number(fontSize), italicFlag: italicFlag === '1', boldFlag: boldFlag === '1'};
    });
    const remarkSectionText = getSectionText(wtt, '凡例', '種別');
    const [, ...remarkData] = remarkSectionText.split('Remark');
    const remarkTexts:remarkText[] = remarkData.map((remarkRow) => {
      const [isInbound, remark] = remarkRow.split('=');
      const [xPos, yPos, isVertical, textColor, content,] = remark.split(',');
      return { isInbound: isInbound === '1', x: Number(xPos), y: Number(yPos), isVertical: isVertical === '1', textColor, content }
    });
    const trainService:trainService[] = getSectionText(wtt, '種別', '行先').split('\n').map((value) => {
      const [, trainServiceData] = value.split('=');
      const [serviceType, serviceAbbr, timetableColorText] = trainServiceData.split(',');
      return {serviceType, serviceAbbr, timetableColor : `#${timetableColorText}`};
    });
    const destinations:destination[] = getSectionText(wtt, '行先', '下り').split('\n').map((value) => {
      const [, destinationData] = value.split('=');
      const [destination, displayText] = destinationData.split(',');
      return {destination, displayText};
    });

    const getTrainData = (trainText:string) => {
      const [destination, trainID, trainServiceName, trainServiceNumber, departureTime, serviceType, operationDatePattern] = trainText.split(',');
      return {destination, trainID, trainServiceName, trainServiceNumber, departureTime, serviceType, operationDatePattern};
    };

    const outboundTrainsSectionText = getSectionText(wtt, '下り', '上り');
    let outboundTrains:trainData[] = outboundTrainsSectionText.length ? outboundTrainsSectionText.split('\n').map(getTrainData) : [];
    const inboundTrainsSectionText = getSectionText(wtt, '上り');
    let inboundTrains:trainData[] = inboundTrainsSectionText.length ? inboundTrainsSectionText.split('\n').map(getTrainData) : [];

    return {
      title,
      remarks : {
        ...remarkFontStyle,
        ...{
          texts: remarkTexts,
        },
      },
      timetable: {
        timetableDefaultDirection,
        trainsPerHour,
        title: {
          color: `#${titleColor}`,
          mainTitle: {
            ...titleFontStyle,
            ...{
              text: timetableTitleText,
            }
          },
          subtitles : {
            ...subtitleFontStyle,
            ...{
              texts : [
                timetableSupervisor,
                timetableValidDate,
              ],
            },
          },
        },
        header: {
          outboundTitle: timetableOutboundTitle,
          inboundTitle: timetableInboundTitle,
          directionFontStyle: headerDirectionFontStyle,
          hourFontStyle: headerHourFontStyle,
          weekdayColor: `#${weekdayColor}`,
          weekdayBackGround: `#${weekdayBackGround}`,
          saturdayColor: `#${saturdayColor}`,
          saturdayBackground: `#${saturdayBackground}`,
          holidayColor: `#${holidayColor}`,
          holidayBackground: `#${holidayBackground}`,
        },
        cell: {
          width: cellWidth,
          height: cellHeight,
          time: {
            ...cellTimeFontStyle,
            ...{
              x: cellTimePosX,
              y: cellTimePosY,
            },
          },
          service: {
            ...cellTrainServiceFontStyle,
            ...{
              x: cellTrainServicePosX,
              y: cellTrainServicePosY,
              display: trainServiceDisplayFlag === 1,
            }
          },
          destination: {
            ...cellTrainDestinationFontStyle,
            ...{
              x: destinationPosX,
              y: destinationPosY,
              display: destinationDisplayFlag === 1,
            }
          },
        },
      },
      trainService,
      destinations,
      outboundTrains,
      inboundTrains,
    };
  }
})();

export default wdttParse;