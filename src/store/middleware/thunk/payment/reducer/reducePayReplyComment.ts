import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { ReplyCommentUI } from 'enevti-app/types/core/asset/redeemable_nft/reply_comment_asset';

export const reducePayReplyComment = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({ type: 'payment/reducePayReplyComment' });
    dispatch(setPaymentStatusInReducer({ action: 'replyComment', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<ReplyCommentUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'replyComment',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'replyComment', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'replyComment', type: 'error', message: err.message }));
  }
};
