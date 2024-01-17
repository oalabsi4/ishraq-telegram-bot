import axios from 'axios';
import { getBoardMembers } from './getBoardMembers.js';
import { getBoardLabels } from './getBoardLabels.js';
import { createTrelloCard } from './createTrelloCard.js';
import type { TrelloCardProps } from './trelloTypes.js';

export const Boards = {
  VideoBoard: {
    boardId: '60e6a69b5343fc3d2b82d5ff',
    name: 'لوح الفيديو',
    lists: { name: 'المهام', id: '60e6a820beeadf6d22e582c2' },
  },
  DesignBoard: {
    boardId: '60e6b8d80634d977dddcbe58',
    name: 'لوح التصميم',
    lists: { name: 'المهام', id: '620b63c83140a206c402aa6b' },
  },
  MarketingBoard: {
    boardId: '60e6bad7d727ed37b00026d2',
    name: 'لوح التسويق',
    lists: { name: 'المهام', id: '60e6bae3012ee15eb7fbdd3d' },
  },
  ManagementBoard: {
    boardId: '60e6ba19aecb55720a1a34fd',
    name: 'لوح الإدارة',
    lists: { name: 'المهام', id: '60e6ba24d6bf3d89a71f729a' },
  },
  TestBoard: {
    boardId: '641c924cef9a979adb5b60c8',
    name: 'لوح الاختبار',
    lists: { name: 'المهام', id: '641c92a4b19bc3713010d066' },
  },
};
// console.log(api)
export async function getBoardsIds() {
  const date = new Date(2024, 0, 16, 23, 49, 0).toISOString();
  const testData: TrelloCardProps = {
    name: 'test',
    desc: 'test',
    idList: '641c92a4b19bc3713010d066',
    urlSource: null,
    idMembers: ['5d87458d56517b36b7279165'],
    idLabels: ['641c924cd88ffb994e8c2731', '641c924cd88ffb994e8c2736', '641c924cd88ffb994e8c2738'],
    due: '2024-01-17T12:30:00.000Z',
  };
  console.log(date);
  // console.log(await getBoardMembers('641c924cef9a979adb5b60c8'));
  // console.log(await getBoardLabels('641c924cef9a979adb5b60c8'));
  // event.toISOString();
  // await createTrelloCard(testData);
}

//members testing
// [ { name: 'omar alabsi', id: '5d87458d56517b36b7279165' } ]

//tags testing
// { name: 'tag-1', id: '641c924cd88ffb994e8c2731' },
// { name: 'tag-3', id: '641c924cd88ffb994e8c2736' },
// { name: 'tag-2', id: '641c924cd88ffb994e8c2738' },
