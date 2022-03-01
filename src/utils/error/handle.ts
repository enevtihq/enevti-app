import { showSnackbar } from '../../store/slices/ui/global/snackbar';
import { store } from '../../store/state';

export function handleError(err: any) {
  console.log(err.message);
  store.dispatch(
    showSnackbar({
      mode: 'error',
      text: err.message,
    }),
  );
}
