export enum REMOTE_DATA {
  NOT_ASKED = 'NOT_ASKED',
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

export type RemoteData<Error, Data> =
  | { type: REMOTE_DATA.NOT_ASKED }
  | { type: REMOTE_DATA.LOADING }
  | { type: REMOTE_DATA.FAILURE; error: Error }
  | { type: REMOTE_DATA.SUCCESS; data: Data }
