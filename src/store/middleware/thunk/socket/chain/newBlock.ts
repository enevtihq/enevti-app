import { AppThunk } from 'enevti-app/store/state';
import { resetProcessedThisBlockTransaction } from 'enevti-app/store/slices/session/transaction/processedThisBlock';
import { EventRegister } from 'react-native-event-listeners';

export const reduceNewBlock =
  (_payload: any): AppThunk =>
  dispatch => {
    EventRegister.emit('resolveNewBlock');
    dispatch(resetProcessedThisBlockTransaction());
  };
