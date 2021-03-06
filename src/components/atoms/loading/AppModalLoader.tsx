import React from 'react';
import { Modal, Portal, useTheme } from 'react-native-paper';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppActivityIndicator from './AppActivityIndicator';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { wp, hp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  selectModalLoaderMode,
  selectModalLoaderMessage,
  selectModalLoaderShow,
  selectModalLoaderProgress,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { StyleSheet } from 'react-native';

export default function AppModalLoader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const mode = useSelector(selectModalLoaderMode);
  const visible = useSelector(selectModalLoaderShow);
  const message = useSelector(selectModalLoaderMessage);
  const progress = useSelector(selectModalLoaderProgress);

  return (
    <Portal>
      <Modal dismissable={false} visible={visible}>
        <AppListItem
          style={styles.box}
          containerStyle={{ backgroundColor: theme.colors.background }}
          leftContent={<AppActivityIndicator style={styles.activityIndicator} mode={mode} progress={progress} />}>
          <AppTextBody4>{message ? message : t('form:loading')}</AppTextBody4>
        </AppListItem>
      </Modal>
    </Portal>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    box: {
      margin: wp('5%', insets),
      height: hp('5%', insets),
    },
    activityIndicator: {
      marginRight: wp('3%', insets),
      width: wp('7%', insets),
      alignSelf: 'center',
    },
  });
