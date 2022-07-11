import { AppThunk } from 'enevti-app/store/state';
import { selectWalletView, setWalletView } from 'enevti-app/store/slices/ui/view/wallet';

export const reduceWalletBalanceChanged =
  (payload: any, key: string): AppThunk =>
  (dispatch, getState) => {
    const walletView = selectWalletView(getState(), key);
    const newWalletView = Object.assign({}, walletView, { balance: payload });
    dispatch(setWalletView({ key, value: newWalletView }));
  };
