import { Image, Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppBrandBanner from 'enevti-app/components/molecules/brand/AppBrandBanner';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDispatch } from 'react-redux';
import { touchAppOnboarded } from 'enevti-app/store/slices/entities/onboarding/app';
import { isOverlayPermissionGranted } from 'enevti-app/utils/app/permission';

type Props = StackScreenProps<RootStackParamList, 'AppOnboarding'>;

export default function AppOnboarding({ navigation }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);

  const [index, setIndex] = React.useState<number>(0);
  const itemWidth = React.useMemo(() => wp('100%'), []);
  const sliderWidth = React.useMemo(() => wp('100%'), []);

  const onboardingData = React.useMemo(() => {
    return [
      {
        title: t('onboarding:appTitle1'),
        description: t('onboarding:appDescription1'),
        component: (
          <View style={styles.onboardingComponent}>
            {theme.dark ? (
              <Image
                style={styles.componentImage}
                source={require('enevti-app/assets/illustration/welcome-enevti-dark.jpeg')}
              />
            ) : (
              <Image
                style={styles.componentImage}
                source={require('enevti-app/assets/illustration/welcome-enevti-light.jpeg')}
              />
            )}
          </View>
        ),
      },
      {
        title: t('onboarding:appTitle2'),
        description: t('onboarding:appDescription2'),
        component: (
          <View style={styles.onboardingComponent}>
            {theme.dark ? (
              <Image
                style={styles.componentImage}
                source={require('enevti-app/assets/illustration/owned-by-you-dark.jpeg')}
              />
            ) : (
              <Image
                style={styles.componentImage}
                source={require('enevti-app/assets/illustration/owned-by-you-light.jpeg')}
              />
            )}
          </View>
        ),
      },
      {
        title: t('onboarding:appTitle3'),
        description: t('onboarding:appDescription3'),
        component: (
          <View style={styles.onboardingComponent}>
            {theme.dark ? (
              <Image
                style={styles.componentImage}
                source={require('enevti-app/assets/illustration/beyond-web3-dark.jpeg')}
              />
            ) : (
              <Image
                style={styles.componentImage}
                source={require('enevti-app/assets/illustration/beyond-web3-light.jpeg')}
              />
            )}
          </View>
        ),
      },
    ];
  }, [styles.componentImage, styles.onboardingComponent, t, theme.dark]);

  const renderItem = React.useCallback(
    ({ item }: { index?: number; item: { title: string; description: string; component: React.ReactNode } }) => (
      <View style={styles.itemContainer}>
        <AppTextHeading1 style={styles.itemTitle}>{item.title}</AppTextHeading1>
        <AppTextBody3 style={styles.itemDescription}>{item.description} </AppTextBody3>
        <View style={styles.itemComponent}>{item.component}</View>
      </View>
    ),
    [styles.itemComponent, styles.itemContainer, styles.itemDescription, styles.itemTitle],
  );

  const onSnapToItem = React.useCallback(slideIndex => setIndex(slideIndex), []);

  const onActionButtonPress = React.useCallback(async () => {
    dispatch(touchAppOnboarded());
    if (Platform.OS === 'android') {
      const isOverlayPermission = await isOverlayPermissionGranted();
      if (isOverlayPermission) {
        navigation.replace('CreateAccount');
      } else {
        navigation.replace('RequestOverlayPermission');
      }
    } else {
      navigation.replace('CreateAccount');
    }
  }, [navigation, dispatch]);

  return (
    <AppView>
      <View style={styles.container}>
        <AppBrandBanner widthPercentage={0.3} style={styles.logo} />
        <View style={styles.carouselContainer}>
          <Carousel
            data={onboardingData}
            enableMomentum={false}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={onSnapToItem}
            inactiveSlideScale={1}
            inactiveSlideOpacity={0}
          />
        </View>
        <Pagination
          activeDotIndex={index}
          dotsLength={onboardingData.length}
          dotColor={theme.colors.text}
          inactiveDotColor={theme.colors.placeholder}
        />
        <View style={styles.button}>
          <AppPrimaryButton onPress={onActionButtonPress}>{t('onboarding:appButton')}</AppPrimaryButton>
        </View>
      </View>
    </AppView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    button: {
      paddingHorizontal: wp(5),
      paddingVertical: hp(2),
    },
    container: {
      paddingVertical: hp(2),
      flex: 1,
    },
    carouselContainer: {
      flex: 1,
    },
    logo: {
      alignSelf: 'center',
      marginBottom: hp(5),
    },
    onboardingComponent: {
      width: '100%',
      height: '100%',
    },
    componentImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    itemContainer: {
      flex: 1,
      paddingHorizontal: wp(10),
    },
    itemTitle: {
      textAlign: 'center',
      marginBottom: hp(3),
    },
    itemDescription: {
      textAlign: 'center',
      marginBottom: hp(3),
    },
    itemComponent: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
  });
