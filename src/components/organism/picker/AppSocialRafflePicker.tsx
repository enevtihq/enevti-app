import React from 'react';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { StyleSheet, View } from 'react-native';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import Carousel from 'react-native-snap-carousel';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { selectSocialRaffleConfig } from 'enevti-app/store/slices/entities/chainConfig/socialRaffle';
import blockToInterval from 'enevti-app/utils/date/blockToInterval';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import LinearGradient from 'react-native-linear-gradient';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { BLOCK_TIME, getCoinName } from 'enevti-app/utils/constant/identifier';
import { selectChainConfigSynced } from 'enevti-app/store/slices/entities/chainConfig/synced';
import { syncChainConfig } from 'enevti-app/store/middleware/thunk/ui/chainConfig/syncChainConfig';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppTextBodyCustom from 'enevti-app/components/atoms/text/AppTextBodyCustom';
import AppTextHeadingCustom from 'enevti-app/components/atoms/text/AppTextHeadingCustom';
import AppSecondaryButton from 'enevti-app/components/atoms/button/AppSecondaryButton';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { completeTokenUnit, parseAmount } from 'enevti-app/utils/format/amount';
import { selectMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import AppListPickerItem from 'enevti-app/components/molecules/listpicker/AppListPickerItem';
import Color from 'color';

interface AppSocialRafflePickerProps {
  price: string;
  value: number;
  onOKPress: (value: number) => void;
  onCancelPress: (value: number) => void;
  touched?: boolean;
  memoKey?: (keyof AppSocialRafflePickerProps)[];
}

function Component({
  price,
  touched,
  value,
  onOKPress,
  onCancelPress,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppSocialRafflePickerProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const socialRaffleConfig = useSelector(selectSocialRaffleConfig);
  const myProfile = useSelector(selectMyProfileCache);
  const chainConfigSynced = useSelector(selectChainConfigSynced);
  const [blockTime, setBlockTime] = React.useState<number>();
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  const itemWidth = React.useMemo(() => wp('80%'), []);
  const itemHeight = React.useMemo(() => hp('35%'), []);
  const sliderWidth = React.useMemo(() => wp('100%'), []);
  const styles = React.useMemo(() => makeStyles(theme, itemWidth, itemHeight), [theme, itemWidth, itemHeight]);

  const snapPoints = React.useMemo(() => ['85%'], []);
  const onMenuDismiss = React.useCallback(() => {
    setMenuVisible(false);
  }, []);

  const isEligible = React.useMemo(() => {
    if (!price) {
      return false;
    }
    const collectionEligible =
      BigInt(socialRaffleConfig.maxPrice) > BigInt(-1)
        ? BigInt(completeTokenUnit(price)) < BigInt(socialRaffleConfig.maxPrice)
          ? true
          : false
        : true;
    const profileEligible =
      socialRaffleConfig.maxRaffledPerProfile > -1
        ? myProfile.raffled < socialRaffleConfig.maxRaffledPerProfile
          ? true
          : false
        : true;
    return collectionEligible && profileEligible;
  }, [myProfile.raffled, price, socialRaffleConfig.maxPrice, socialRaffleConfig.maxRaffledPerProfile]);

  const eligibility = React.useMemo(() => {
    let ret = t('createNFT:socialRaffleEligibilityFirst');
    if (BigInt(socialRaffleConfig.maxPrice) > BigInt(-1)) {
      ret += `, ${t('createNFT:socialRaffleEligibilityPriceSpecified', {
        amount: parseAmount(socialRaffleConfig.maxPrice),
        currency: getCoinName(),
      })}`;
    } else {
      ret += `, ${t('createNFT:socialRaffleEligibilityPriceUnspecified')}`;
    }
    ret += '.';
    if (socialRaffleConfig.maxRaffledPerProfile > -1) {
      ret += ` ${t('createNFT:socialRaffleEligibilityAnd')}, ${t('createNFT:socialRaffleEligibilityCreator', {
        count: socialRaffleConfig.maxRaffledPerProfile,
      })}.`;
    }
    return ret;
  }, [socialRaffleConfig.maxPrice, socialRaffleConfig.maxRaffledPerProfile, t]);

  React.useEffect(() => {
    const initSocialRafflePicker = async () => {
      setBlockTime(await BLOCK_TIME());
      if (!chainConfigSynced) {
        dispatch(syncChainConfig());
      }
    };
    initSocialRafflePicker();
  }, [chainConfigSynced, dispatch]);

  const renderItem = React.useCallback(
    ({ item }: { index?: number; item: { icon: string; step: number; title: string; description: string } }) => (
      <View style={styles.items}>
        <View style={styles.itemHead}>
          <LinearGradient style={styles.itemHeadGradient} colors={[theme.colors.primary, theme.colors.secondary]} />
          <AppIconComponent name={item.icon} size={hp(8)} color={'white'} />
        </View>
        <View style={styles.itemFooter}>
          <AppTextHeading3 style={styles.itemFooterTitle}>
            {item.step}. {item.title}
          </AppTextHeading3>
          <AppTextBody4>{item.description}</AppTextBody4>
        </View>
      </View>
    ),
    [
      styles.itemFooter,
      styles.itemFooterTitle,
      styles.itemHead,
      styles.itemHeadGradient,
      styles.items,
      theme.colors.primary,
      theme.colors.secondary,
    ],
  );

  const keyExtractor = React.useCallback(item => item.step, []);

  const socialRaffleStep = React.useMemo(() => {
    return [
      {
        icon: iconMap.likeActive,
        step: 1,
        title: t('createNFT:raffleStep1Title'),
        description: t('createNFT:raffleStep1Description'),
      },
      {
        icon: iconMap.rank,
        step: 2,
        title: t('createNFT:raffleStep2Title'),
        description: t('createNFT:raffleStep2Description', {
          block: socialRaffleConfig.blockInterval,
          interval: blockToInterval(socialRaffleConfig.blockInterval * (blockTime ?? 1)),
        }),
      },
      {
        icon: iconMap.portion,
        step: 3,
        title: t('createNFT:raffleStep3Title'),
        description: `${t('createNFT:raffleStep3Description', {
          percentage: socialRaffleConfig.rewardsCutPercentage,
        })}${
          socialRaffleConfig.maxRaffledPerCollection > -1
            ? t('createNFT:raffleStep3MaxMintPerCollection', { count: socialRaffleConfig.maxRaffledPerCollection })
            : t('createNFT:raffleStep3UnlimitedMint')
        }`,
      },
      {
        icon: iconMap.gift,
        step: 4,
        title: t('createNFT:raffleStep4Title'),
        description: t('createNFT:raffleStep4Description'),
      },
      {
        icon: iconMap.raffleHappy,
        step: 5,
        title: t('createNFT:raffleStep5Title'),
        description: t('createNFT:raffleStep5Description'),
      },
    ];
  }, [
    blockTime,
    socialRaffleConfig.blockInterval,
    socialRaffleConfig.maxRaffledPerCollection,
    socialRaffleConfig.rewardsCutPercentage,
    t,
  ]);

  return (
    <>
      {!price ? (
        <AppListPickerItem
          showDropDown
          disabled
          icon={iconMap.socialRaffleSetting}
          title={t('createNFT:enableSocialRaffle')}
          description={t('createNFT:setPriceFirst')}
          style={styles.pickerItem}
        />
      ) : !touched ? (
        <AppListPickerItem
          showDropDown
          onPress={() => setMenuVisible(!menuVisible)}
          icon={iconMap.socialRaffleSetting}
          title={t('createNFT:enableSocialRaffle')}
          description={t('createNFT:enableSocialRaffleDescription')}
          style={styles.pickerItem}
        />
      ) : value === -1 ? (
        <AppListPickerItem
          showDropDown
          onPress={() => setMenuVisible(!menuVisible)}
          icon={iconMap.socialRaffleDeactivated}
          title={t('createNFT:socialRaffledDisabled')}
          description={t('createNFT:socialRaffledDisabledDesc')}
          style={styles.pickerItem}
        />
      ) : value === 0 ? (
        <AppListPickerItem
          showDropDown
          onPress={() => setMenuVisible(!menuVisible)}
          icon={iconMap.socialRaffleActivated}
          title={t('createNFT:socialRaffledEnabled')}
          description={t('createNFT:socialRaffledEnabledDesc')}
          style={styles.pickerItem}
        />
      ) : null}
      <AppMenuContainer
        enablePanDownToClose={false}
        onDismiss={onMenuDismiss}
        visible={menuVisible}
        snapPoints={snapPoints}>
        <AppHeaderWizard
          noHeaderSpace
          style={styles.alertContainer}
          title={t('createNFT:socialRaffleTitle')}
          description={t('createNFT:socialRaffleDescription')}
        />
        <View>
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
              keyExtractor={keyExtractor}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
            />
          </NativeViewGestureHandler>
        </View>
        <View style={styles.eligibilityContainer}>
          <AppListItem
            leftContent={
              <AppIconComponent
                style={styles.eligibilityIcon}
                name={isEligible ? iconMap.eligible : iconMap.notEligible}
                size={hp(4)}
                color={isEligible ? theme.colors.success : theme.colors.error}
              />
            }>
            <AppTextHeadingCustom size={1.8} numberOfLines={1}>
              {isEligible ? t('createNFT:socialRaffleIsEligible') : t('createNFT:socialRaffleIsNotEligible')}
            </AppTextHeadingCustom>
            <AppTextBodyCustom size={1.38} style={styles.eligibilityDescription}>
              {eligibility}
            </AppTextBodyCustom>
          </AppListItem>
        </View>
        <View style={styles.actionContainer}>
          {isEligible ? (
            <View style={styles.buttonContainer}>
              <View style={styles.buttonItem}>
                <AppSecondaryButton
                  onPress={() => {
                    onMenuDismiss();
                    onCancelPress(-1);
                  }}>
                  {t('createNFT:socialRaffleActionEligibleButtonCancel')}
                </AppSecondaryButton>
              </View>
              <View style={styles.buttonContainerSpace} />
              <View style={styles.buttonItem}>
                <AppPrimaryButton
                  onPress={() => {
                    onMenuDismiss();
                    onOKPress(0);
                  }}>
                  {t('createNFT:socialRaffleActionEligibleButtonOK')}
                </AppPrimaryButton>
              </View>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <View style={styles.buttonItem}>
                <AppSecondaryButton onPress={onMenuDismiss}>
                  {t('createNFT:socialRaffleActionNotEligibleButton')}
                </AppSecondaryButton>
              </View>
            </View>
          )}
          <AppTextBody4>
            {isEligible ? t('createNFT:socialRaffleActionEligible') : t('createNFT:socialRaffleActionNotEligible')}
          </AppTextBody4>
        </View>
      </AppMenuContainer>
    </>
  );
}

const makeStyles = (theme: Theme, itemWidth: number, itemHeight: number) =>
  StyleSheet.create({
    alertContainer: {
      marginBottom: hp('3%'),
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
    itemFooter: {
      marginVertical: hp(3),
      paddingHorizontal: wp(5),
    },
    itemFooterTitle: {
      marginBottom: hp(1),
    },
    itemHeadGradient: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    buttonContainer: {
      paddingHorizontal: wp('5%'),
      paddingBottom: wp('10%'),
      marginTop: hp('3%'),
      flexDirection: 'row',
    },
    buttonItem: {
      flex: 1,
    },
    buttonContainerSpace: {
      marginHorizontal: wp('1%'),
    },
    eligibilityContainer: {
      marginTop: hp(3),
    },
    eligibilityIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp(3),
    },
    eligibilityDescription: {
      color: theme.colors.placeholder,
    },
    actionContainer: {
      flex: 1,
      flexDirection: 'column-reverse',
      alignItems: 'center',
    },
    pickerItem: {
      backgroundColor: theme.dark
        ? Color(theme.colors.background).lighten(0.5).rgb().string()
        : Color(theme.colors.background).darken(0.04).rgb().string(),
    },
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
