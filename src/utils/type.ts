export interface LoginParams {
  username: string;
  password: string;
}

export const GET_SECRET_KEY_URL = 'api.base.vn/extapi/oauth/client';
export const LOGIN_URL = 'api.base.vn/ajax/mobile/login';
export const MOBILE_CLIENTS_URL = 'checkin.base.vn/ajax/api/me/clients';
export const CHECKIN_URL = 'checkin.base.vn/ajax/api/me/checkin/mobile';
export const HISTORY_CHECKIN_URL = 'checkin.base.vn/ajax/api/me/logs';
export const LOGOUT_URL = 'api.base.vn/extapi/oauth/logout';
