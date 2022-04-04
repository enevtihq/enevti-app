import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { store } from 'enevti-app/store/state';
import { ABORT_ERROR_MESSAGE } from './message';

const silentError = [ABORT_ERROR_MESSAGE];

const includeSubstring = (message: string) => (item: string) =>
  message.toLowerCase().includes(item.toLowerCase());

export function handleError(err: any) {
  console.log(err.message);
  if (silentError.some(includeSubstring(err.message))) {
    return;
  } else {
    store.dispatch(
      showSnackbar({
        mode: 'error',
        text: err.message,
      }),
    );
  }
}
