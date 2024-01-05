/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      notionToken: string;
      dataBaseId: string;
      mistralToken: string;
    }
  }
}

export type NotionRes = {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  cover: null | string;
  icon: null | string;
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  properties: NotionProps;
  url: string;
  public_url: null | string;
};

export type NotionProps =
  & Record<'رمز المنتج', NotionSelect>
  & Record<'minutes', NotionFormula<FormuaTypeNumber>>
  & Record<'الصفحات', NotionNumber>
  & Record<'NO-PARTNER', NotionRelation>
  & Record<'الشريك', NotionFormula<FormuaTypeString>>
  & Record<'سعر يدوي', NotionNumber>
  & Record<'metric', NotionFormula<FormuaTypeString>>
  & Record<'شرح الرمز', NotionFormula<FormuaTypeString>>
  & Record<'تاريخ الاستلام', NotionDate>
  & Record<'دليل استعمال الجدول',NotionFormula<FormuaTypeString>>
  & Record<'المجموع', NotionFormula<FormuaTypeNumber>>
  & Record<'KMK-PRICING', NotionRelation>
  & Record<'العميل', NotionSelect>
  & Record<'المدة', NotionText>
  & Record<'seconds', NotionFormula<FormuaTypeNumber>>
  & Record<'QYAM-PRICING', NotionRelation>
  & Record<'Created time', NotionCreateTime>
  & Record<'Created by', NotionCreatedBy>
  & Record<'الموظف المنتج', NotionSelect>
  & Record<'السعر', NotionFormula<FormuaTypeNumber>>
  & Record<'العدد', NotionNumber>
  & Record<'النوع', NotionFormula<FormuaTypeString>>
  & Record<'الوصف', NotionTitle>
  & Record<'رابط المنتج', NotionUrl>
  
  
export type RestructuredData = {
  productCode: string;
  codeDescription: string;
  date: string;
  minutes: number ;
  partner: string;
  itemTitle: string;
  itemType: string;
  cient: string;
  itemCount: number | null;
  pageCount: number ;
  employee: string;
  manualPrice: number | null;
  autoPrice: number | null;
  totalPrice: number | null;
  productURL: string;
}
  
// type NotionProps = Record<
//   NotionPropKeys,
//   | NotionSelect
//   | NotionFormula
//   | NotionRelation
//   | NotionDate
//   | NotionCreateTime
//   | NotionCreatedBy
//   | NotionTitle
//   | NotionText
//   | NotionUrl
//   | NotionNumber
// >;

// type NotionPropKeys =
//   | 'رمز المنتج'
//   | 'minutes'
//   | 'الصفحات'
//   | 'NO-PARTNER'
//   | 'الشريك'
//   | 'سعر يدوي'
//   | 'metric'
//   | 'تاريخ الاستلام'
//   | 'دليل استعمال الجدول'
//   | 'المجموع'
//   | 'KMK-PRICING'
//   | 'العميل'
//   | 'المدة'
//   | 'seconds'
//   | 'QYAM-PRICING'
//   | 'Created time'
//   | 'Created by'
//   | 'الموظف المنتج'
//   | 'السعر'
//   | 'العدد'
//   | 'النوع'
//   | 'رابط المنتج'
//   | 'الوصف';

type NotionSelect = {
  id: string;
  type: 'select';
  select: {
    id: string;
    name: string;
    color: string;
  };
};
type NotionFormula<T extends FormuaTypeNumber | FormuaTypeString> = {
  id: string;
  type: 'formula';
  formula: T;
};
type FormuaTypeNumber = {
  type: 'number';
  number: number | null;
};
type FormuaTypeString = {
  type: 'string';
  string: string;
};
type NotionRelation = {
  id: string;
  type: 'relation';
  relation: {
    id: string;
  }[];
  has_more: boolean;
};

type NotionDate = {
  id: string;
  type: 'date';
  date: {
    start: string;
    end: null;
    time_zone: null;
  };
};

type NotionNumber = {
  id: string;
  type: 'number';
  number: number | null;
};

type NotionText = {
  id: string;
  type: 'rich_text';
  rich_text: {
    type: string;
    text: {
      content: string;
      link: null | string;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: null | string;
  }[];
};
type NotionCreateTime = {
  id: string;
  type: 'created_time';
  created_time: string;
};
type NotionCreatedBy = {
  id: string;
  type: 'created_by';
  created_by: {
    object: string;
    id: string;
  };
};
type NotionUrl = {
  id: string;
  type: 'url';
  url: string;
};
type NotionTitle = {
  id: string;
  type: 'title';
  title: {
    type: string;
    text: {
      content: string;
      link: null | string;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: null | string;
  }[];
};
