import { View, Image, TextInput, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCreateMomentQueue } from 'enevti-app/store/slices/queue/moment/create';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader, { HEADER_HEIGHT_COMPACT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { Divider, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppMentionInput from 'enevti-app/components/molecules/form/AppMentionInput';
import { useTranslation } from 'react-i18next';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import utilityToLabel from 'enevti-app/utils/format/utilityToLabel';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';

type Props = StackScreenProps<RootStackParamList, 'CreateMoment'>;

export default function CreateMoment({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const inputRef = React.useRef<TextInput>(null);
  const createMomentQueue = useSelector(selectCreateMomentQueue);
  const [value, setValue] = React.useState<string>(() => (createMomentQueue.text ? createMomentQueue.text : ''));

  return (
    <AppView
      dismissKeyboard
      withModal
      withPayment
      withLoader
      edges={['bottom', 'left', 'right']}
      headerOffset={insets.top + hp(HEADER_HEIGHT_COMPACT_PERCENTAGE)}
      header={
        <AppHeader compact back backIcon={iconMap.close} backIconSize={23} navigation={navigation} title={' '} />
      }>
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnailBox}>
          <Image source={{ uri: createMomentQueue.cover }} style={styles.thumbnail} resizeMode={'cover'} />
        </View>
      </View>
      <AppMentionInput
        bottom
        inputRef={inputRef}
        value={value}
        onChange={e => {
          setValue(e);
        }}
        placeholder={t('createMoment:captionPlaceholder')}
        style={styles.captionInput}
        suggestionStyle={styles.suggestionInput}
      />
      <Divider style={styles.divider} />
      {createMomentQueue.nft ? (
        <View style={styles.nftContainer}>
          <AppNFTRenderer imageSize={'s'} nft={createMomentQueue.nft} width={wp(10)} style={styles.nftRenderer} />
          <View style={styles.attachedTo}>
            <AppTextBody5 style={{ color: theme.colors.placeholder }}>{t('createMoment:attachedTo')}</AppTextBody5>
            <AppTextHeading3>{`${createMomentQueue.nft.symbol}#${createMomentQueue.nft.serial}`}</AppTextHeading3>
          </View>
          <View style={styles.utilityLabel}>
            <AppTextBody5>{utilityToLabel(createMomentQueue.nft.utility)}</AppTextBody5>
          </View>
        </View>
      ) : null}
      <View style={styles.actionContainer}>
        <View style={{ height: hp('2%', insets) }} />
        <AppPrimaryButton disabled={!value} style={styles.actionButton}>
          {!value ? t('createMoment:captionRequired') : t('createMoment:mintMoment')}
        </AppPrimaryButton>
        <View style={{ height: Platform.OS === 'ios' ? insets.bottom : hp('2%', insets) }} />
      </View>
    </AppView>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    thumbnailContainer: {
      height: hp(38),
      justifyContent: 'center',
      alignItems: 'center',
    },
    thumbnailBox: {
      height: hp(36),
      aspectRatio: 0.5625,
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    thumbnail: {
      height: '100%',
      width: '100%',
    },
    divider: {
      marginHorizontal: wp(3),
      marginBottom: hp(3),
    },
    nftContainer: {
      flexDirection: 'row',
      marginHorizontal: wp(3),
    },
    attachedTo: {
      flex: 1,
      justifyContent: 'center',
    },
    utilityLabel: {
      justifyContent: 'center',
    },
    captionInput: {
      minHeight: hp(6, insets),
      maxHeight: hp(14, insets),
      marginHorizontal: wp(3),
    },
    suggestionInput: {
      position: 'absolute',
      width: '100%',
      marginTop: hp(8),
      zIndex: 999,
    },
    nftRenderer: {
      width: wp(10),
      marginRight: wp('2%'),
      alignSelf: 'center',
      borderRadius: wp(10),
      overflow: 'hidden',
    },
    actionContainer: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      width: '100%',
      bottom: 0,
    },
    actionButton: {
      marginHorizontal: wp(5),
    },
  });
