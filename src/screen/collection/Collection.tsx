import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import AppView from '../../components/atoms/view/AppView';
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
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import AppActivityIndicator from '../../components/atoms/loading/AppActivityIndicator';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../theme/default';
import AppCollectionHeader from '../../components/organism/collection/AppCollectionHeader';

type Props = StackScreenProps<RootStackParamList, 'Collection'>;

export default function Collection({ route }: Props) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);
  const [collectionHeaderHeight, setCollectionHeaderHeight] =
    React.useState<number>(0);

  const collection = useSelector(selectCollectionView);
  const collectionUndefined = useSelector(isCollectionUndefined);

  const onCollectionHeaderLayout = React.useCallback((e: LayoutChangeEvent) => {
    setCollectionHeaderHeight(e.nativeEvent.layout.height);
  }, []);

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
    <AppView darken translucentStatusBar edges={['bottom', 'left', 'right']}>
      <AppCollectionHeader
        collection={collection}
        onLayout={onCollectionHeaderLayout}
      />
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
