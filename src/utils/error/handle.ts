import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { store } from 'enevti-app/store/state';
import { ABORT_ERROR_MESSAGE } from './message';
import i18n from 'enevti-app/translations/i18n';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';

const silentError = [ABORT_ERROR_MESSAGE, 'Abort', 'NFT status is not pending-secret'];

const includeSubstring = (message: string) => (item: string) => message.toLowerCase().includes(item.toLowerCase());

export function handleError(err: any, key: string = 'message', silent: boolean = false) {
  if (silentError.some(includeSubstring(err[key]))) {
    return;
  } else {
    if (!silent) {
      store.dispatch(
        showSnackbar({
          mode: 'error',
          text: err[key],
        }),
      );
    }
  }
}

export function handleResponseCode(res: Response, ret: ResponseJSON<any>) {
  if (res.status === 404) {
    throw {
      code: 404,
      message: i18n.t('error:notFound'),
    };
  } else if (res.status === 400) {
    throw {
      code: 400,
      message: i18n.t('error:clientError'),
    };
  } else if (res.status !== 200) {
    throw {
      code: res.status,
      message: i18n.t('error:responseError', { msg: JSON.stringify(ret.data) }),
    };
  }
}

export function responseError(status: number, data: any = {}, meta: any = {}): APIResponse<any, any, any> {
  return {
    status,
    data,
    meta,
  };
}

export function isErrorResponse(response: APIResponse<any>) {
  return typeof response.data === 'object' && Object.keys(response.data).length === 0;
}
