import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTheme } from 'react-native-paper';
import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { Theme } from 'enevti-app/theme/default';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { setCreateNFTQueueType } from 'enevti-app/store/slices/queue/nft/create/type';
import {
  setCreateNFTOneKindMime,
  setCreateNFTOneKindURI,
} from 'enevti-app/store/slices/queue/nft/create/onekind';
import AppCameraGalleryPicker from 'enevti-app/components/organism/picker/AppCameraGalleryPicker';

type Props = StackScreenProps<RootStackParamList, 'ChooseNFTType'>;

export default function ChooseNFTType({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const [oneKindSheetVisible, setOneKindSheetVisible] =
    React.useState<boolean>(false);

  const onOneKindImagePicked = (image: ImageOrVideo) => {
    dispatch(setCreateNFTQueueType('onekind'));
    dispatch(setCreateNFTOneKindURI(image.path));
    dispatch(setCreateNFTOneKindMime(image.mime));
    setOneKindSheetVisible(false);
    navigation.replace('ChooseNFTTemplate', { mode: 'normal' });
  };

  const onOneKindImagePressed = React.useCallback(
    () => setOneKindSheetVisible(visible => !visible),
    [],
  );

  const onOneKindImageDismiss = React.useCallback(
    () => setOneKindSheetVisible(false),
    [],
  );

  return (
    <AppView withModal>
      <AppHeaderWizard
        back
        backIcon={iconMap.close}
        navigation={navigation}
        title={t('createNFT:chooseNFTTypeTitle')}
        description={t('createNFT:chooseNFTTypeDescription')}
        style={styles.header}
      />

      <View style={{ height: hp('3%', insets) }} />

      <AppListItem
        style={styles.nftTypeItem}
        onPress={onOneKindImagePressed}
        leftContent={
          <AppIconGradient
            name={iconMap.nftOneKind}
            size={40}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.nftTypeIcon}
          />
        }>
        <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
          {t('createNFT:oneKindTitle')}
        </AppTextHeading3>
        <AppTextBody4 style={{ color: theme.colors.placeholder }}>
          {t('createNFT:oneKindDescription')}
        </AppTextBody4>
      </AppListItem>
      <AppCameraGalleryPicker
        visible={oneKindSheetVisible}
        onSelected={onOneKindImagePicked}
        onDismiss={onOneKindImageDismiss}
      />

      <AppListItem
        style={styles.nftTypeItem}
        onPress={() =>
          dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon :)' }))
        }
        leftContent={
          <AppIconGradient
            name={iconMap.nftPartitioned}
            size={40}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.nftTypeIcon}
          />
        }>
        <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
          {t('createNFT:packTitle')}
        </AppTextHeading3>
        <AppTextBody4 style={{ color: theme.colors.placeholder }}>
          {t('createNFT:packDescription')}
        </AppTextBody4>
      </AppListItem>
    </AppView>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
    },
    headerImage: {
      alignSelf: 'center',
      marginVertical: hp('2%', insets),
    },
    nftTypeIcon: {
      marginRight: wp('4%', insets),
      alignSelf: 'center',
    },
    nftTypeItem: {
      margin: 10,
    },
  });
