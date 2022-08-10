import React from 'react';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { StyleSheet, View } from 'react-native';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { selectSocialRaffleConfig } from 'enevti-app/store/slices/entities/chainConfig/socialRaffle';
import blockToInterval from 'enevti-app/utils/date/blockToInterval';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import LinearGradient from 'react-native-linear-gradient';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { BLOCK_TIME } from 'enevti-app/utils/constant/identifier';

interface AppSocialRafflePickerProps {
  memoKey?: (keyof AppSocialRafflePickerProps)[];
}

function Component({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppSocialRafflePickerProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const socialRaffleConfig = useSelector(selectSocialRaffleConfig);
  const [blockTime, setBlockTime] = React.useState<number>();

  const itemWidth = React.useMemo(() => wp('80%', insets), [insets]);
  const itemHeight = React.useMemo(() => hp('35%', insets), [insets]);
  const sliderWidth = React.useMemo(() => wp('100%', insets), [insets]);
  const styles = React.useMemo(
    () => makeStyles(theme, insets, itemWidth, itemHeight),
    [theme, insets, itemWidth, itemHeight],
  );

  React.useEffect(() => {
    const getBlockTime = async () => setBlockTime(await BLOCK_TIME());
    getBlockTime();
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { index?: number; item: { icon: string; step: number; title: string; description: string } }) => (
      <View style={styles.items}>
        <View style={styles.itemHead}>
          <LinearGradient style={styles.itemHeadGradient} colors={[theme.colors.primary, theme.colors.secondary]} />
          <AppIconComponent name={item.icon} size={hp(8)} color={'white'} />
        </View>
        <View style={{ marginVertical: hp(3), paddingHorizontal: wp(5) }}>
          <AppTextHeading3 style={{ marginBottom: hp(1) }}>
            {item.step}. {item.title}
          </AppTextHeading3>
          <AppTextBody4>{item.description}</AppTextBody4>
        </View>
      </View>
    ),
    [styles.itemHead, styles.itemHeadGradient, styles.items, theme.colors.primary, theme.colors.secondary],
  );

  const socialRaffleStep = React.useMemo(() => {
    return [
      {
        icon: iconMap.likeActive,
        step: 1,
        title: 'Gather Like',
        description: 'People can give like to your collection',
      },
      {
        icon: iconMap.rank,
        step: 2,
        title: 'Ranking Period',
        description: `Every ${socialRaffleConfig.blockInterval} blocks (${blockToInterval(
          socialRaffleConfig.blockInterval * (blockTime ?? 1),
        )}), Collection will be ranked based on the like they get on that period`,
      },
      {
        icon: iconMap.portion,
        step: 3,
        title: 'Minting Top Collection',
        description: `${socialRaffleConfig.rewardsCutPercentage}% of total block reward will be allocated to mint top liked Collection`,
      },
      {
        icon: iconMap.gift,
        step: 4,
        title: 'Airdrop!',
        description: 'Minted items will be raffled to random people who give like to selected collection',
      },
      {
        icon: iconMap.raffleHappy,
        step: 5,
        title: 'Happy!',
        description: 'As a creator, you will get paid by tokens. And, people will get FREE NFT with specified utility!',
      },
    ];
  }, [blockTime, socialRaffleConfig.blockInterval, socialRaffleConfig.rewardsCutPercentage]);

  return (
    <AppMenuContainer
      enablePanDownToClose={true}
      onDismiss={() => console.log('dismiss')}
      visible={true}
      snapPoints={['90%']}>
      <AppHeaderWizard
        noHeaderSpace
        style={styles.alertContainer}
        title={'Empowering Social Wisdom!'}
        description={'Here is how Social Raffle works:'}
      />
      <NativeViewGestureHandler disallowInterruption={true}>
        <Carousel
          loop
          autoplay={true}
          autoplayInterval={8000}
          enableMomentum={true}
          decelerationRate={'fast'}
          inactiveSlideOpacity={0.2}
          data={socialRaffleStep}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
        />
      </NativeViewGestureHandler>
    </AppMenuContainer>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets, itemWidth: number, itemHeight: number) =>
  StyleSheet.create({
    alertContainer: {
      width: wp('90%', insets),
      marginBottom: hp('3%', insets),
      alignSelf: 'center',
      flex: 0,
    },
    items: {
      width: itemWidth,
      height: itemHeight,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.colors.placeholder,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: 'hidden',
    },
    itemHead: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemHeadGradient: { position: 'absolute', width: '100%', height: '100%' },
  });

const AppSocialRafflePicker = React.memo(Component, (prevProps, nextProps) => {
  if (prevProps.memoKey) {
    let ret = true;
    prevProps.memoKey.forEach(key => {
      if (prevProps[key] !== nextProps[key]) {
        ret = false;
      }
    });
    return ret;
  } else {
    return shallowEqual(prevProps, nextProps);
  }
});

export default AppSocialRafflePicker;
