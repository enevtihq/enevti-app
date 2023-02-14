import {
  selectPaymentActionMeta,
  selectPaymentActionPayload,
  setPaymentStatusInReducer,
} from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-types/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { uploadTextToIPFS } from 'enevti-app/service/ipfs';
import { CommentMomentUI } from 'enevti-types/asset/redeemable_nft/comment_moment_asset';

export const reducePayCommentMoment = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({ type: 'payment/reducePayCommentMoment' });
    dispatch(setPaymentStatusInReducer({ action: 'commentMoment', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<CommentMomentUI>;
    const meta = selectPaymentActionMeta(getState());
    payload.asset.cid = await uploadTextToIPFS(meta);

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'commentMoment',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'commentMoment', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'commentMoment', type: 'error', message: err.message }));
  }
};
