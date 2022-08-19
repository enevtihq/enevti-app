import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { CommentCollectionClubsUI } from 'enevti-app/types/core/asset/redeemable_nft/comment_collection_clubs_asset';

export const reducePayCommentCollectionClubs = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({ type: 'payment/reducePayCommentCollectionClubs' });
    dispatch(setPaymentStatusInReducer({ action: 'commentCollectionClubs', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<CommentCollectionClubsUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'commentCollectionClubs',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'commentCollectionClubs', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'commentCollectionClubs', type: 'error', message: err.message }));
  }
};
