import React from 'react';
import { Modal, Portal, useTheme } from 'react-native-paper';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppActivityIndicator from './AppActivityIndicator';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { wp, hp } from 'enevti-app/utils/layout/imageRatio';
import { useSelector } from 'react-redux';
import {
  selectModalLoaderMode,
  selectModalLoaderMessage,
  selectModalLoaderShow,
  selectModalLoaderProgress,
  selectModalLoaderDescription,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { StyleSheet } from 'react-native';
import AppTextBody5 from '../text/AppTextBody5';

export default function AppModalLoader() {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(), []);
  const mode = useSelector(selectModalLoaderMode);
  const visible = useSelector(selectModalLoaderShow);
  const message = useSelector(selectModalLoaderMessage);
  const description = useSelector(selectModalLoaderDescription);
  const progress = useSelector(selectModalLoaderProgress);

  return (
    <Portal>
      <Modal dismissable={false} visible={visible}>
        <AppListItem
          style={styles.box}
          containerStyle={{ backgroundColor: theme.colors.background }}
          leftContent={<AppActivityIndicator style={styles.activityIndicator} mode={mode} progress={progress} />}>
          <AppTextBody4>{message ? message : t('form:loading')}</AppTextBody4>
          {description ? <AppTextBody5>{description}</AppTextBody5> : null}
        </AppListItem>
      </Modal>
    </Portal>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    box: {
      margin: wp('5%'),
      height: hp('5%'),
    },
    activityIndicator: {
      marginRight: wp('3%'),
      width: wp('7%'),
      alignSelf: 'center',
    },
  });
