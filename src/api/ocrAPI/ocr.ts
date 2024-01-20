import axios from 'axios';
import FormData from 'form-data';

export async function imageOCR(link: string) {
  const type = link.substring(link.length - 3);
  const data = new FormData();
  data.append('language', 'ara');
  data.append('isOverlayRequired', 'false');
  data.append('url', link);
  data.append('iscreatesearchablepdf', 'false');
  data.append('issearchablepdfhidetextlayer', 'false');
  data.append('filetype', type.toUpperCase());
  data.append('scale', 'true');
  data.append('OCREngine', '1');

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.ocr.space/parse/image',
    headers: {
      apikey: process.env.OCR_API,
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const result = await axios(config);
    const res = result.data as OcrResponseData;
    const ParsedText = res.ParsedResults[0].ParsedText;
    return ParsedText;
  } catch (error) {
    console.log(error);
    return;
  }
}

type OcrResponseData = {
  ParsedResults: [
    {
      TextOverlay: object[];
      TextOrientation: string;
      FileParseExitCode: number;
      ParsedText: string;
      ErrorMessage: string;
      ErrorDetails: string;
    }
  ];
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ProcessingTimeInMilliseconds: string;
  SearchablePDFURL: string;
};
