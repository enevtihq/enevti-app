import React from 'react';
import { Modal, Portal, useTheme } from 'react-native-paper';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppActivityIndicator from './AppActivityIndicator';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  selectModalLoaderMessage,
  selectModalLoaderShow,
} from 'enevti-app/store/slices/ui/global/modalLoader';

export default function AppModalLoader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const visible = useSelector(selectModalLoaderShow);
  const message = useSelector(selectModalLoaderMessage);

  return (
    <Portal>
      <Modal dismissable={false} visible={visible}>
        <AppListItem
          style={{
            margin: wp('5%', insets),
          }}
          containerStyle={{ backgroundColor: theme.colors.background }}
          leftContent={
            <AppActivityIndicator style={{ marginRight: wp('5%', insets) }} />
          }>
          <AppTextBody4>{message ? message : t('form:loading')}</AppTextBody4>
        </AppListItem>
      </Modal>
    </Portal>
  );
}
