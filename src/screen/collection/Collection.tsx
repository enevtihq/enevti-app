import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AppView from '../../components/atoms/view/AppView';
import AppNetworkImage from '../../components/atoms/image/AppNetworkImage';
import { IPFStoURL } from '../../service/ipfs';
import { hp, wp } from '../../utils/imageRatio';
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

type Props = StackScreenProps<RootStackParamList, 'Collection'>;

export default function Collection({ route }: Props) {
  const { id } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);
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
          marginHorizontal: wp('5%', insets),
          marginVertical: hp('2%', insets),
        }}>
        <AppTextHeading2>
          {collection.name}{' '}
          <AppTextBody3 style={{ color: theme.colors.placeholder }}>
            ({collection.symbol})
          </AppTextBody3>
        </AppTextHeading2>

        <AppTextBody4
          style={{ marginVertical: hp('0.5%', insets) }}
          readMoreLimit={100}>
          {collection.description}
        </AppTextBody4>
      </View>
    </AppView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  });
