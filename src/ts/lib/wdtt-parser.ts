export const wdttParse = (() => {
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
    const titleSection = getSectionText(wtt, 'WinDIATimeTable', '表示').trim().split('\n');
    const title = titleSection.pop() ?? '';

    const [timetableTitleText, timetableValidDate, timetableSupervisor, timetableOutboundTitle, timetableInboundTitle, timetableStyle, cellStyle, colorStyle, ...fontStyle] = getSectionText(wtt, '表示', '凡例').split('\n');
    const [timetableOrientation, trainsPerHour] = timetableStyle.split(',').map(Number);
    const [cellWidth, cellHeight, cellTimePosX, cellTimePosY, cellTrainServicePosX, cellTrainServicePosY, destinationPosX, destinationPosY, trainServiceDisplayFlag, destinationDisplayFlag] = cellStyle.split(',').map(Number);
    const [titleColor, weekdayColor, weekdayBackground, saturdayColor, saturdayBackground, holidayColor, holidayBackground] = colorStyle.split(',');
    const [titleFontStyle, subtitleFontStyle, headerDirectionFontStyle, headerHourFontStyle, cellTimeFontStyle, cellTrainServiceFontStyle, cellTrainDestinationFontStyle, remarkFontStyle] = fontStyle.map(styles => {
      const [fontFamily, fontSize, isBold, isItalic] = styles.split(',');
      return {fontFamily, fontSize: Number(fontSize), isBold: isBold === '1', isItalic: isItalic === '1'};
    });
    const remarkSectionText = getSectionText(wtt, '凡例', '種別');
    const remarks = remarkSectionText.match(/Remark[01]=[0-9]+,[0-9]+,[0-9]+,[0-9A-F]+,(.|\n(?=\t))+/g) || [];

    const remarkTexts:remarkText[] = remarks.map((remarkRow) => {
      const [,isInbound, xPos, yPos, isVertical, textColor, content] = remarkRow.match(/Remark([01])=([0-9]+),([0-9]+),([0-9]+),([0-9A-F]+),([\S\s]+)/) as RegExpMatchArray;
      return {
        isInbound: isInbound === '1',
        x: Number(xPos), y: Number(yPos),
        isVertical: isVertical === '1',
        textColor : `#${textColor}`,
        content : content.replace(/\t/g, ''),
      }
    });

    const trainServices:trainService[] = getSectionText(wtt, '種別', '行先').split('\n').map((value) => {
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
      const [serviceType, trainID, trainServiceName, trainServiceNumber, departureTime, destination, operationDate] = trainText.split(',');
      return {
        serviceType: Number(serviceType),
        trainID, trainServiceName,
        trainServiceNumber: trainServiceNumber === '' ? null : Number(trainServiceNumber),
        departureTime,
        destination: Number(destination),
        operationDate: Number(operationDate)
      };
    };

    const outboundTrainsSectionText = getSectionText(wtt, '下り', '上り');
    const outboundTrains:trainData[] = outboundTrainsSectionText.length ? outboundTrainsSectionText.split('\n').map(getTrainData) : [];
    const inboundTrainsSectionText = getSectionText(wtt, '上り');
    const inboundTrains:trainData[] = inboundTrainsSectionText.length ? inboundTrainsSectionText.split('\n').map(getTrainData) : [];

    return {
      title,
      remarks : {
        ...remarkFontStyle,
        ...{
          texts: remarkTexts,
        },
      },
      timetable: {
        orientation: timetableOrientation,
        trainsPerHour,
        titles: {
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
          weekdayBackground: `#${weekdayBackground}`,
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
      trainServices,
      destinations,
      outboundTrains,
      inboundTrains,
    };
  }
})();
