import { GET_MATCH_STATUS, MATCH_STATUS } from "../types/matchTypes";

export const getMatchStatus: GET_MATCH_STATUS = (
  startTime,
  endTime,
  now = new Date(),
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime) || Number.isNaN(end.getTime)) {
    return undefined;
  }

  if (start > now) {
    return MATCH_STATUS.SCHEDULED;
  }
  if (end <= now) {
    return MATCH_STATUS.FINISHED;
  }

  return MATCH_STATUS.LIVE;
};

export const syncMatchStatus = async (match: any, updateStatus:any) => {
  const nextStatus = getMatchStatus(
    match.startTime,
    match.endTime,
  );
  if (!nextStatus) {
    return match.status;
  }

  if (match.status !== nextStatus) {
    await updateStatus(nextStatus);
    match.status = nextStatus;
  }
  return match.status;
};