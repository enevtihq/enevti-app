import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import AppView from '../../components/atoms/view/AppView';
import AppNetworkImage from '../../components/atoms/image/AppNetworkImage';
import { IPFStoURL } from '../../service/ipfs';
import { hp, SafeAreaInsets, wp } from '../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  resetStatusBarBackground,
  setStatusBarBackground,
} from '../../store/slices/ui/global/statusbar';
import { RootStackParamList } from '../../navigation';
import {
  loadCollection,
  unloadCollection,
} from '../../store/middleware/thunk/ui/view/collection';
import {
  isCollectionUndefined,
  selectCollectionView,
} from '../../store/slices/ui/view/collection';
import { StyleSheet, View } from 'react-native';
import AppActivityIndicator from '../../components/atoms/loading/AppActivityIndicator';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../theme/default';
import AppCollectionMintingAvailable from '../../components/molecules/collection/AppCollectionMintingAvailable';
import AppTextHeading2 from '../../components/atoms/text/AppTextHeading2';
import AppTextBody3 from '../../components/atoms/text/AppTextBody3';
import AppTextBody4 from '../../components/atoms/text/AppTextBody4';
import AppAvatarRenderer from '../../components/molecules/avatar/AppAvatarRenderer';
import AppTextHeading3 from '../../components/atoms/text/AppTextHeading3';
import AppTextHeading4 from '../../components/atoms/text/AppTextHeading4';
import { numberKMB, parseAmount } from '../../utils/format/amount';
import Color from 'color';
import AppCurrencyIcon from '../../components/atoms/icon/AppCurrencyIcon';
import AppQuaternaryButton from '../../components/atoms/button/AppQuaternaryButton';
import { iconMap } from '../../components/atoms/icon/AppIconComponent';

type Props = StackScreenProps<RootStackParamList, 'Collection'>;

export default function Collection({ route }: Props) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const now = React.useMemo(() => Date.now(), []);
  const collection = useSelector(selectCollectionView);
  const collectionUndefined = useSelector(isCollectionUndefined);

  const mintingAvailable = React.useMemo(
    () =>
      collection.minting.expire <= now || collection.minting.available === 0
        ? false
        : true,
    [collection.minting.expire, collection.minting.available, now],
  );

  const coverWidth = React.useMemo(() => wp('100%', insets), [insets]);
  const coverHeight = React.useMemo(
    () => insets.top + coverWidth * 0.5625,
    [coverWidth, insets],
  );

  const onCollectionScreenLoaded = React.useCallback(
    () => dispatch(loadCollection(id)),
    [id, dispatch],
  );

  React.useEffect(() => {
    dispatch(setStatusBarBackground('transparent'));
    onCollectionScreenLoaded();
    return function cleanup() {
      dispatch(resetStatusBarBackground());
      dispatch(unloadCollection());
    };
  }, [dispatch, onCollectionScreenLoaded]);

  return !collectionUndefined ? (
    <AppView translucentStatusBar edges={['bottom', 'left', 'right']}>
      <AppNetworkImage
        url={IPFStoURL(collection.cover)}
        style={{ width: coverWidth, height: coverHeight }}
      />
      {mintingAvailable ? (
        <AppCollectionMintingAvailable collection={collection} />
      ) : null}
      <View
        style={{
          paddingHorizontal: wp('5%', insets),
          paddingVertical: hp('2%', insets),
        }}>
        <AppTextHeading2>
          {collection.name}{' '}
          <AppTextBody3 style={{ color: theme.colors.placeholder }}>
            ({collection.symbol})
          </AppTextBody3>
        </AppTextHeading2>

        <View
          style={{
            marginBottom: hp('1.5%', insets),
            marginTop: hp('0.5%', insets),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            Created By:{' '}
          </AppTextBody4>
          <AppAvatarRenderer
            photo={collection.originAddress.photo}
            address={collection.originAddress.address}
            size={wp('5%', insets)}
            style={{ marginHorizontal: wp('2%', insets) }}
          />
          <AppTextHeading4
            numberOfLines={1}
            style={{
              width: wp('40%', insets),
              height: '100%',
            }}>
            {collection.originAddress.username
              ? collection.originAddress.username
              : collection.originAddress.address}
          </AppTextHeading4>
        </View>

        <AppTextBody4 readMoreLimit={95}>{collection.description}</AppTextBody4>

        <View style={styles.collectionChipsContainer}>
          <AppQuaternaryButton
            icon={iconMap.likeActive}
            iconSize={hp('3%', insets)}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%', insets),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(256, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
          <AppQuaternaryButton
            icon={iconMap.commentFill}
            iconSize={hp('3%', insets)}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%', insets),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(12, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
          <AppQuaternaryButton
            icon={iconMap.twitter}
            iconSize={hp('3%', insets)}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%', insets),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(1120, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
        </View>

        <View style={styles.collectionStatsContainer}>
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {numberKMB(collection.stat.minted, 2)}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              Items
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {collection.stat.owner}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              Owners
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <View style={styles.collectionCurrency}>
              <AppCurrencyIcon
                currency={collection.stat.floor.currency}
                size={15}
                style={styles.collectionCurrencyIcon}
              />
              <AppTextHeading3 numberOfLines={1}>
                {parseAmount(collection.stat.floor.amount, true, 2)}
              </AppTextHeading3>
            </View>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              Floor Price
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {collection.stat.redeemed}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              Redeemed
            </AppTextBody4>
          </View>
        </View>
      </View>
    </AppView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    collectionStatsContainer: {
      flexDirection: 'row',
      marginVertical: hp('1%', insets),
      height: hp('5.2%', insets),
    },
    collectionStatsItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    collectionCurrency: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    collectionCurrencyIcon: {
      marginLeft: -5,
    },
    collectionStatsDivider: {
      height: '50%',
      alignSelf: 'center',
      borderWidth: 0.3,
      borderColor: Color(theme.colors.placeholder).alpha(0.1).rgb().toString(),
    },
    collectionChipsContainer: {
      height: hp('3%', insets),
      marginVertical: hp('2%', insets),
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
