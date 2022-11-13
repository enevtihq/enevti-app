import { View, FlatList } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { useTranslation } from 'react-i18next';
import { Divider } from 'react-native-paper';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import AppActivityIndicator from '../../atoms/loading/AppActivityIndicator';
import { useSelector } from 'react-redux';
import { isMomentUndefined, selectMomentView } from 'enevti-app/store/slices/ui/view/moment';
import { selectFeedView } from 'enevti-app/store/slices/ui/view/feed';
import AppAddMoment from './AppAddMoment';
import AppMomentItem from './AppMomentItem';

const center = 'center';

interface AppRecentMomentsProps {}

export default function AppRecentMoments({}: AppRecentMomentsProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const feeds = useSelector(selectFeedView);
  const moments = useSelector(selectMomentView);
  const momentsUndefined = useSelector(isMomentUndefined);

  const onMomentsPress = (_id: string) => {};

  const renderItem = React.useCallback(
    ({ item }: any) => (
      <AppMomentItem
        url={IPFStoURL(item.photo)}
        title={item.username}
        style={{ marginRight: wp('2%', insets) }}
        onPress={() => onMomentsPress(item.id)}
      />
    ),
    [insets],
  );

  const listHeaderComponent = React.useCallback(() => <AppAddMoment />, []);

  const listFooterComponent = React.useCallback(() => <View style={{ width: wp('3%', insets) }} />, [insets]);

  const keyExtractor = React.useCallback(item => item.id, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: wp('27%', insets),
      offset: wp('27%', insets) * index,
      index,
    }),
    [insets],
  );

  return !momentsUndefined ? (
    feeds && feeds.length > 0 ? (
      <View>
        <View
          style={{
            paddingHorizontal: wp('5%', insets),
            marginVertical: hp('2%', insets),
          }}>
          <AppTextHeading3>{t('home:recentMoments')}</AppTextHeading3>
        </View>
        <FlatList
          horizontal
          data={moments}
          ListHeaderComponent={listHeaderComponent}
          ListFooterComponent={listFooterComponent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={4}
          maxToRenderPerBatch={1}
          updateCellsBatchingPeriod={500}
          windowSize={7}
          getItemLayout={getItemLayout}
        />
        <Divider
          style={{
            marginHorizontal: wp('5%', insets),
            marginTop: hp('2%', insets),
            marginBottom: wp('5%', insets),
          }}
        />
      </View>
    ) : (
      <View style={{ marginBottom: wp('5%', insets) }} />
    )
  ) : (
    <View style={{ height: hp('32.75%', insets), justifyContent: center }}>
      <AppActivityIndicator animating />
    </View>
  );
}
