import {
  selectPaymentActionMeta,
  selectPaymentActionPayload,
  setPaymentStatusInReducer,
} from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-types/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { ReplyCommentClubsUI } from 'enevti-types/asset/redeemable_nft/reply_comment_clubs_asset';
import { uploadTextToIPFS } from 'enevti-app/service/ipfs';

export const reducePayReplyCommentClubs = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({ type: 'payment/reducePayReplyCommentClubs' });
    dispatch(setPaymentStatusInReducer({ action: 'replyCommentClubs', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<ReplyCommentClubsUI>;
    const meta = selectPaymentActionMeta(getState());
    payload.asset.cid = await uploadTextToIPFS(meta);

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'replyCommentClubs',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'replyCommentClubs', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'replyCommentClubs', type: 'error', message: err.message }));
  }
};
