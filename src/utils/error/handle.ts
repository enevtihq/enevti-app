import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { store } from 'enevti-app/store/state';

export function handleError(err: any) {
  console.log(err.message);
  store.dispatch(
    showSnackbar({
      mode: 'error',
      text: err.message,
    }),
  );
}
