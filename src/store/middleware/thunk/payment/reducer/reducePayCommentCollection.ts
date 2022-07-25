import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { CommentCollectionUI } from 'enevti-app/types/core/asset/redeemable_nft/comment_collection_asset';
import { selectMyProfileBalanceCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import i18n from 'enevti-app/translations/i18n';

export const reducePayCommentCollection = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({ type: 'payment/reducePayCommentCollection' });
    dispatch(setPaymentStatusInReducer({ action: 'commentCollection', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<CommentCollectionUI>;
    const myBalance = selectMyProfileBalanceCache(getState());
    if (BigInt(myBalance) < BigInt(payload.fee)) {
      throw Error(i18n.t('payment:notEnoughBalance'));
    }

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(setPaymentStatusInReducer({ action: 'commentCollection', type: 'success', message: '' }));
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'commentCollection', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'commentCollection', type: 'error', message: err.message }));
  }
};
