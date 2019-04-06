declare module '@tom-konda/wdtt-parser' {
  export default function (wdtt: string) : wdttDefaultJSON
}

type fontStyle = {
  fontFamily: string,
  fontSize: number,
  italicFlag: boolean,
  boldFlag: boolean,
}

type fontStyleMergedType<T> = fontStyle & T;

type subtitles = fontStyleMergedType<{
  texts: string[],
}>

type remarkText = {
  isInbound: boolean,
  x: number,
  y: number,
  isVertical: boolean,
  textColor: string,
  content: string,
}

type remarks = fontStyleMergedType<{
  texts: remarkText[],
}>

type coordinate = {x: number, y: number}

type cellTimeStyle = fontStyleMergedType<coordinate>

type cell = {
  width: number,
  height: number,
  time: cellTimeStyle,
  service: fontStyleMergedType<coordinate & {
    display: boolean,
  }>,
  destination: fontStyleMergedType<coordinate & {
    display: boolean,
  }>,
}

type timetable = {
  timetableDefaultDirection: number,
  trainsPerHour: number,
  title: {
    color: string,
    mainTitle: fontStyleMergedType<{
      text: string,
    }>,
    subtitles: subtitles,
  }
  header: {
    outboundTitle: string,
    inboundTitle: string,
    directionFontStyle: fontStyle,
    hourFontStyle: fontStyle,
    weekdayColor: string,
    weekdayBackGround: string,
    saturdayColor: string,
    saturdayBackground: string,
    holidayColor: string,
    holidayBackground: string,
  },
  cell: cell
}

type trainService = {
  serviceType: string,
  serviceAbbr: string,
  timetableColor: string
}

type destination = {
  destination: string,
  displayText: string,
}

type trainData = {
  serviceType: number,
  trainID: string,
  trainServiceName: string,
  trainServiceNumber: number | null,
  departureTime: string,
  destination: number,
  operationDatePattern: number,
}

type wdttDefaultJSON = {
  title : string,
  remarks: remarks,
  timetable: timetable,
  trainService: trainService[],
  destinations: destination[],
  inboundTrains: trainData[],
  outboundTrains: trainData[],
}