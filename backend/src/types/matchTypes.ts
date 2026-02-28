export type GET_MATCH_STATUS = (
  startTime: string,
  endTime: string,
  now?: Date,
) => "scheduled" | "live" | "finished" | undefined;

export enum MATCH_STATUS {
  SCHEDULED = "scheduled",
  LIVE = "live",
  FINISHED = "finished",
}
