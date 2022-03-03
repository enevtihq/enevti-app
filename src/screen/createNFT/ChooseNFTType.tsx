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

type Props = StackScreenProps<RootStackParamList, 'ChooseNFTType'>;

export default function ChooseNFTType({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(insets);

  return (
    <AppView>
      <AppHeaderWizard
        back
        navigation={navigation}
        component={
          <View style={styles.headerImage}>
            <ChooseNFTTypeIMG
              width={wp('80%', insets)}
              height={hp('20%', insets)}
            />
          </View>
        }
        title={'Choose NFT Type'}
        description={
          'Every single NFT is unique! Choose how you will turn your creation into NFT!'
        }
        style={styles.header}
      />

      <View style={{ height: hp('3%', insets) }} />

      <AppListItem
        style={styles.nftTypeItem}
        leftContent={
          <AppIconGradient
            name={iconMap.nftOneKind}
            size={40}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.nftTypeIcon}
          />
        }>
        <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
          One of a Kind
        </AppTextHeading3>
        <AppTextBody4 style={{ color: theme.colors.placeholder }}>
          Create NFT based on one image
        </AppTextBody4>
      </AppListItem>

      <AppListItem
        style={styles.nftTypeItem}
        leftContent={
          <AppIconGradient
            name={iconMap.nftPartitioned}
            size={40}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.nftTypeIcon}
          />
        }>
        <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
          Pack
        </AppTextHeading3>
        <AppTextBody4 style={{ color: theme.colors.placeholder }}>
          Create NFT based on many image with gamification option
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
