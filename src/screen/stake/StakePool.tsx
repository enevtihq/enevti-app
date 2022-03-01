import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppView from '../../components/atoms/view/AppView';
import AppHeader from '../../components/atoms/view/AppHeader';
import AppFloatingActionButton from '../../components/atoms/view/AppFloatingActionButton';
import { StakePoolData, StakerItem } from '../../types/service/enevti/stake';
import { getStakePoolCompleteData } from '../../service/enevti/stake';
import { handleError } from '../../utils/error/handle';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { FlatList, FlatListProps, RefreshControl } from 'react-native';
import AppStakerItem, {
  STAKER_ITEM_HEIGHT_PERCENTAGE,
} from '../../components/organism/stake/AppStakerItem';
import { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from '../../components/molecules/list/AppListItem';
import { hp } from '../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { iconMap } from '../../components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/state';
import { selectPersona } from '../../store/slices/entities/persona';
import { Persona } from '../../types/service/enevti/persona';

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<StakerItem>>(FlatList);

type Props = StackScreenProps<RootStackParamList, 'StakePool'>;

export default function StakePool({ navigation, route }: Props) {
  const { persona } = route.params;
  const myPersona = useSelector((state: RootState) =>
    selectPersona(state),
  ) as Persona;

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const extendedTreshold = hp('10%', insets);

  const [stakePool, setStakePool] = React.useState<StakePoolData>();
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [extended, setExtended] = React.useState(true);
  const UIExtended = useSharedValue(true);

  const setJSExtended = (value: boolean) => {
    setExtended(value);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      if (event.contentOffset.y > extendedTreshold) {
        if (UIExtended.value) {
          runOnJS(setJSExtended)(false);
          UIExtended.value = false;
        }
      } else {
        if (!UIExtended.value) {
          runOnJS(setJSExtended)(true);
          UIExtended.value = true;
        }
      }
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // async onSaleRefreshFunction Here
    setRefreshing(false);
  };

  const onLoaded = React.useCallback(async () => {
    try {
      const pool = await getStakePoolCompleteData(persona.address);
      if (pool) {
        setStakePool(pool);
      }
    } catch (err: any) {
      handleError(err);
    }
  }, [persona.address]);

  React.useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  const renderItem = React.useCallback(
    ({ item }: any) => <AppStakerItem staker={item} />,
    [],
  );

  const keyExtractor = React.useCallback(
    item => item.rank.toString() + item.persona.address,
    [],
  );

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length:
        STAKER_ITEM_HEIGHT_PERCENTAGE + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE,
      offset:
        (STAKER_ITEM_HEIGHT_PERCENTAGE + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE) *
        index,
      index,
    }),
    [],
  );

  return (
    <AppView
      darken
      edges={['left', 'bottom', 'right']}
      header={
        <AppHeader back navigation={navigation} title={t('stake:stakePool')} />
      }>
      <AppFloatingActionButton
        label={
          persona.address === myPersona.address
            ? t('stake:selfStake')
            : t('stake:addStake')
        }
        icon={iconMap.add}
        extended={extended}
      />
      <AnimatedFlatList
        onScroll={onScroll}
        scrollEventThrottle={16}
        data={stakePool?.staker}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        initialNumToRender={2}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={5}
        getItemLayout={getItemLayout}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </AppView>
  );
}
