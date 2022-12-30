import {
  selectPaymentActionMeta,
  selectPaymentActionPayload,
  setPaymentStatusInReducer,
} from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { uploadTextToIPFS } from 'enevti-app/service/ipfs';
import { CommentMomentClubsUI } from 'enevti-app/types/core/asset/redeemable_nft/comment_moment_clubs_asset';

export const reducePayCommentMomentClubs = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({ type: 'payment/reducePayCommentMomentClubs' });
    dispatch(setPaymentStatusInReducer({ action: 'commentMomentClubs', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<CommentMomentClubsUI>;
    const meta = selectPaymentActionMeta(getState());
    payload.asset.cid = await uploadTextToIPFS(meta);

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'commentMomentClubs',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'commentMomentClubs', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'commentMomentClubs', type: 'error', message: err.message }));
  }
};
