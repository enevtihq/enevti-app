import { AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { selectOnceUserMeta, touchOnceUserMeta } from 'enevti-app/store/slices/entities/once/userMeta';
import { postSetUserMeta } from 'enevti-app/service/enevti/userMeta';
import { detectLanguage } from 'enevti-app/translations/i18n';
import { Platform } from 'react-native';

export const initUserMeta = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'userMeta/initUserMeta',
  async (_, { dispatch, getState, signal }) => {
    try {
      const isUserMetaAlreadySetted = selectOnceUserMeta(getState());
      if (!isUserMetaAlreadySetted) {
        const locale = detectLanguage();
        const os = Platform.OS;
        const res = await postSetUserMeta({ locale, os }, signal);
        if (res.status === 200) {
          dispatch(touchOnceUserMeta());
        }
      }
    } catch (err) {
      handleError(err, undefined, true);
    }
  },
);
