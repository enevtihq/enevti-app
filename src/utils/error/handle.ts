import { showSnackbar } from '../../store/slices/ui/global';
import { store } from '../../store/state';

export function handleError(err: any) {
  store.dispatch(
    showSnackbar({
      mode: 'error',
      text: err.message,
    }),
  );
}
