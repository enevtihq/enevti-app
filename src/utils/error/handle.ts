import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { store } from 'enevti-app/store/state';
import { ABORT_ERROR_MESSAGE } from './message';
import i18n from 'enevti-app/translations/i18n';
import { APIResponse, APIResponseVersionRoot, ResponseJSON } from 'enevti-app/types/core/service/api';

const silentError = [ABORT_ERROR_MESSAGE, 'Abort', 'NFT status is not pending-secret'];
const substractErrorString = ['Error: '];

const includeSubstring = (message: string) => (item: string) => message.toLowerCase().includes(item.toLowerCase());

export function handleError(err: any, key: string = 'message', silent: boolean = false) {
  let error = err[key] as string;
  substractErrorString.forEach(t => {
    error = error.replace(t, '');
  });
  if (silentError.some(includeSubstring(error))) {
    return;
  } else {
    console.warn(error);
    if (!silent) {
      store.dispatch(
        showSnackbar({
          mode: 'error',
          text: error,
        }),
      );
    }
  }
}

export function handleResponseCode(res: Response, ret: ResponseJSON<any>) {
  if (res.status === 404) {
    const err = Error(i18n.t('error:notFound')) as any;
    err.code = 404;
    throw err;
  } else if (res.status === 400) {
    const err = Error(i18n.t('error:clientError')) as any;
    err.code = 400;
    throw err;
  } else if (res.status !== 200) {
    const err = Error(i18n.t('error:responseError', { msg: JSON.stringify(ret.data) })) as any;
    err.code = res.status;
    throw err;
  }
}

export function responseError(
  status: number,
  data: any = {},
  meta: any = {},
  version: any = {},
): APIResponse<any, any, any> | APIResponseVersionRoot<any, any> {
  return {
    status,
    data,
    meta,
    version,
  };
}

export function isErrorResponse(response: APIResponse<any>) {
  return typeof response.data === 'object' && Object.keys(response.data).length === 0;
}
