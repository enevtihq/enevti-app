import { View, FlatList } from 'react-native';
import React from 'react';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { useTranslation } from 'react-i18next';
import { Divider } from 'react-native-paper';
import AppActivityIndicator from '../../atoms/loading/AppActivityIndicator';
import { useSelector } from 'react-redux';
import { isRecentMomentUndefined, selectRecentMoment } from 'enevti-app/store/slices/ui/view/recentMoment';
import { selectFeedView } from 'enevti-app/store/slices/ui/view/feed';
import AppAddMoment from './AppAddMoment';
import AppMomentItem from './AppMomentItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { MomentBase } from 'enevti-app/types/core/chain/moment';

const center = 'center';

interface AppRecentMomentsProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppRecentMoments({ navigation }: AppRecentMomentsProps) {
  const { t } = useTranslation();

  const feeds = useSelector(selectFeedView);
  const moments = useSelector(selectRecentMoment);
  const momentsUndefined = useSelector(isRecentMomentUndefined);

  const onMomentsPress = React.useCallback(
    (index: number) => {
      navigation.push('Moment', { mode: 'feed', index });
    },
    [navigation],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: MomentBase; index: number }) => (
      <AppMomentItem moment={item} style={{ marginRight: wp('2%') }} onPress={() => onMomentsPress(index)} />
    ),
    [onMomentsPress],
  );

  const listHeaderComponent = React.useCallback(() => <AppAddMoment navigation={navigation} />, [navigation]);

  const listFooterComponent = React.useCallback(() => <View style={{ width: wp('3%') }} />, []);

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
