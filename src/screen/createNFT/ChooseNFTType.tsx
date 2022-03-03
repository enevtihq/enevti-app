import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppView from '../../components/atoms/view/AppView';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from '../../utils/imageRatio';
import ChooseNFTTypeIMG from '../../assets/svg/undraw_choose_re_7d5a.svg';
import AppListItem from '../../components/molecules/list/AppListItem';
import AppTextHeading3 from '../../components/atoms/text/AppTextHeading3';
import AppTextBody4 from '../../components/atoms/text/AppTextBody4';
import { useTheme } from 'react-native-paper';
import AppIconGradient from '../../components/molecules/AppIconGradient';
import { iconMap } from '../../components/atoms/icon/AppIconComponent';
import { Theme } from '../../theme/default';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store/slices/ui/global/snackbar';
import AppMenuContainer from '../../components/atoms/menu/AppMenuContainer';
import AppMenuItem from '../../components/atoms/menu/AppMenuItem';
import { menuItemHeigtPercentage } from '../../utils/layout/menuItemHeigtPercentage';

type Props = StackScreenProps<RootStackParamList, 'ChooseNFTType'>;

export default function ChooseNFTType({ navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(insets);

  const [oneKindSheetVisible, setOneKindSheetVisible] =
    React.useState<boolean>(false);

  const dispatch = useDispatch();

  return (
    <AppView withModal>
      <AppHeaderWizard
        back
        navigation={navigation}
        component={
          <View style={styles.headerImage}>
            <ChooseNFTTypeIMG
              width={wp('80%', insets)}
              height={hp('18%', insets)}
            />
          </View>
        }
        title={t('createNFT:chooseNFTTypeTitle')}
        description={t('createNFT:chooseNFTTypeDescription')}
        style={styles.header}
      />

      <View style={{ height: hp('3%', insets) }} />

      <AppMenuContainer
        visible={oneKindSheetVisible}
        snapPoints={[`${menuItemHeigtPercentage(2)}%`]}
        tapEverywhereToDismiss={true}
        onDismiss={() => setOneKindSheetVisible(false)}
        anchor={
          <AppListItem
            style={styles.nftTypeItem}
            onPress={() => setOneKindSheetVisible(!oneKindSheetVisible)}
            leftContent={
              <AppIconGradient
                name={iconMap.nftOneKind}
                size={40}
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.nftTypeIcon}
              />
            }>
            <AppTextHeading3
              numberOfLines={1}
              style={{ width: wp('50%', insets) }}>
              {t('createNFT:oneKindTitle')}
            </AppTextHeading3>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {t('createNFT:oneKindDescription')}
            </AppTextBody4>
          </AppListItem>
        }>
        <AppMenuItem
          onPress={() => {}}
          icon={iconMap.camera}
          title={t('createNFT:openCamera')}
        />
        <AppMenuItem
          onPress={() => {}}
          icon={iconMap.gallery}
          title={t('createNFT:pickFromGallery')}
        />
      </AppMenuContainer>

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

const makeStyle = (insets: SafeAreaInsets) =>
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
