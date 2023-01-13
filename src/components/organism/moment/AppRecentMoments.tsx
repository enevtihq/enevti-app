import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { useTranslation } from 'react-i18next';
import { Divider, useTheme } from 'react-native-paper';
import AppActivityIndicator from '../../atoms/loading/AppActivityIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { isRecentMomentUndefined, selectRecentMomentState } from 'enevti-app/store/slices/ui/view/recentMoment';
import { selectFeedView } from 'enevti-app/store/slices/ui/view/feed';
import AppAddMoment from './AppAddMoment';
import AppMomentItem from './AppMomentItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { MomentBase } from 'enevti-app/types/core/chain/moment';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';
import { Theme } from 'enevti-app/theme/default';
import { loadMoreFeedsMoment } from 'enevti-app/store/middleware/thunk/ui/view/feed';

const center = 'center';

interface AppRecentMomentsProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppRecentMoments({ navigation }: AppRecentMomentsProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const dnavigation = useDebouncedNavigation(navigation);

  const feeds = useSelector(selectFeedView);
  const recentMomentState = useSelector(selectRecentMomentState);
  const momentsUndefined = useSelector(isRecentMomentUndefined);

  const onMomentsPress = React.useCallback(
    (index: number) => {
      dnavigation('Moment', { mode: 'feed', index });
    },
    [dnavigation],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: MomentBase; index: number }) => (
      <AppMomentItem moment={item} style={{ marginRight: wp('2%') }} onPress={() => onMomentsPress(index)} />
    ),
    [onMomentsPress],
  );

  const listHeaderComponent = React.useCallback(() => <AppAddMoment navigation={navigation} />, [navigation]);

  const listFooterComponent = React.useCallback(() => {
    return recentMomentState.reqVersion !== recentMomentState.items.length && recentMomentState.items.length !== 0 ? (
      <View style={styles.footerLoading}>
        <AppActivityIndicator animating />
      </View>
    ) : (
      <View style={styles.footer} />
    );
  }, [recentMomentState.items.length, recentMomentState.reqVersion, styles.footer, styles.footerLoading]);

  const handleLoadMore = React.useCallback(() => {
    dispatch(loadMoreFeedsMoment());
  }, [dispatch]);

  const keyExtractor = React.useCallback(item => item.id, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: wp('27%'),
      offset: wp('27%') * index,
      index,
    }),
    [],
  );

  return !momentsUndefined ? (
    feeds && feeds.length > 0 ? (
      <View>
        <View
          style={{
            paddingHorizontal: wp('5%'),
            marginVertical: hp('2%'),
          }}>
          <AppTextHeading3>{t('home:recentMoments')}</AppTextHeading3>
        </View>
        <FlatList
          horizontal
          data={recentMomentState.items}
          ListHeaderComponent={listHeaderComponent}
          ListFooterComponent={listFooterComponent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={4}
          maxToRenderPerBatch={7}
          updateCellsBatchingPeriod={500}
          windowSize={7}
          getItemLayout={getItemLayout}
          onEndReachedThreshold={0.25}
          onEndReached={handleLoadMore}
        />
        <Divider
          style={{
            marginHorizontal: wp('5%'),
            marginTop: hp('2%'),
            marginBottom: wp('5%'),
          }}
        />
      </View>
    ) : (
      <View style={{ marginBottom: wp('5%') }} />
    )
  ) : (
    <View style={{ height: hp('32.75%'), justifyContent: center }}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    footerLoading: {
      height: wp(25) * 1.78,
      width: wp(25),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      overflow: 'hidden',
      marginRight: wp('3%'),
    },
    footer: {
      width: wp('3%'),
    },
  });
