export type BoardMembersResponseType = {
  id: string;
  fullName: string;
  username: string;
}[];

export type BoardLabelsResponseType = {
  id: string;
  idBoard: string;
  name: string;
  color: string;
  uses: number;
}[];

export type TrelloCardProps = {
  name: string;
  desc: string;
  idList: string;
  urlSource: string | null;
  idMembers: string[];
  idLabels: string[] | [];
  due: string;
};
