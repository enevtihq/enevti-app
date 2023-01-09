import {
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import React from 'react';
import Color from 'color';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppMentionRenderer from 'enevti-app/components/molecules/comment/AppMentionRenderer';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import darkTheme from 'enevti-app/theme/dark';
import { numberKMB } from 'enevti-app/utils/format/amount';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { MomentsData } from 'enevti-app/store/slices/ui/view/moment';
import LinearGradient from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AppMomentViewItemProps {
  item: MomentsData;
  index: number;
  momentHeight: number;
  controlVisible: boolean;
  currentVisibleIndex: number;
  onLongPress: () => void;
  onPress: () => void;
  onPressOut: () => void;
  onCommentPress: (id: string) => void;
  onLikePress: (id: string, target: string) => void;
  controlOpacity: SharedValue<number>;
  audioIndicatorAnimatedStyle: StyleProp<ViewStyle>;
  controlAnimatedStyle: StyleProp<ViewStyle>;
  muted: boolean;
  navigation: StackNavigationProp<RootStackParamList>;
}

function Component(
  {
    item,
    index,
    momentHeight,
    controlVisible,
    currentVisibleIndex,
    onLongPress,
    onPress,
    onPressOut,
    onCommentPress,
    onLikePress,
    controlOpacity,
    audioIndicatorAnimatedStyle,
    controlAnimatedStyle,
    muted,
    navigation,
  }: AppMomentViewItemProps,
  ref: any,
) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets, momentHeight), [theme, insets, momentHeight]);
  const dnavigation = useDebouncedNavigation(navigation);
  const [lineLength, setLineLength] = React.useState<number>(0);
  const [lineHeight, setLineHeight] = React.useState<number>(0);
  const [captionCollapsed, setCaptionCollapsed] = React.useState<boolean>(true);
  const textMountedRef = React.useRef<boolean>(false);
  const opacity = useSharedValue(0);
  const animatedCollapsed = useSharedValue(true);

  const captionBackdropAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: animatedCollapsed.value && controlOpacity.value < 1 ? controlOpacity.value : opacity.value };
  }, [controlOpacity]);

  const onCaptionPress = React.useCallback(() => {
    animatedCollapsed.value = !animatedCollapsed.value;
    if (captionCollapsed) {
      opacity.value = withTiming(0, { duration: 500 });
    } else {
      opacity.value = withTiming(1, { duration: 500 });
    }
    setCaptionCollapsed(old => !old);
  }, [captionCollapsed, opacity, animatedCollapsed]);

  const onTextLayout = React.useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (!textMountedRef.current) {
      const lines = e.nativeEvent.lines;
      setLineLength(lines.length);
      setLineHeight(lines[0].height);
      if (lines.length > 2) {
        setCaptionCollapsed(false);
        animatedCollapsed.value = false;
      }
      textMountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAlreadyLiked = React.useCallback(() => {
    dispatch(showSnackbar({ mode: 'info', text: t('home:cannotLike') }));
  }, [dispatch, t]);

  return (
    <View style={styles.momentItemContainer}>
      <Pressable onLongPress={onLongPress} onPress={onPress} onPressOut={onPressOut}>
        <Animated.View style={[styles.audioIndicator, audioIndicatorAnimatedStyle]}>
          <View style={styles.audioIndicatorItem}>
            <AppIconComponent
              name={muted ? iconMap.volumeOff : iconMap.volumeOn}
              size={hp(3)}
              color={darkTheme.colors.text}
              style={{ padding: hp(2) }}
            />
          </View>
        </Animated.View>
        <Video
          repeat
          ref={ref}
          poster={IPFStoURL(item.cover.cid)}
          paused={!controlVisible || currentVisibleIndex !== index}
          source={{ uri: IPFStoURL(item.data.cid) }}
          style={styles.momentItemContainer}
          resizeMode={'contain'}
          muted={muted}
        />
      </Pressable>
      <AnimatedLinearGradient
        pointerEvents={'none'}
        colors={['transparent', Color('#000000').alpha(0.25).rgb().toString()]}
        style={[styles.gradientBottom, controlAnimatedStyle]}
      />
      <Animated.View
        pointerEvents={'none'}
        style={[styles.momentItemContainer, styles.captionBackdrop, captionBackdropAnimatedStyle]}
      />
      <Animated.View pointerEvents={'box-none'} style={[styles.leftContainer, controlAnimatedStyle]}>
        <Pressable
          onPress={() => dnavigation('Profile', { mode: 'a', arg: item.owner.address })}
          style={styles.ownerContainer}>
          <AppAvatarRenderer persona={item.owner} size={hp(3)} style={styles.ownerAvatar} />
          <AppTextHeading3 style={styles.ownerLabel}>{parsePersonaLabel(item.owner, true)}</AppTextHeading3>
        </Pressable>
        <View
          style={{
            marginVertical: hp(2),
            height: lineHeight * (captionCollapsed ? lineLength : lineLength >= 2 ? 2 : 1),
            maxHeight: hp(20),
          }}>
          <ScrollView nestedScrollEnabled scrollEnabled={captionCollapsed}>
            <AppMentionRenderer
              numberOfLines={captionCollapsed ? undefined : 2}
              onTextPress={lineLength > 2 ? onCaptionPress : undefined}
              onTextLayout={onTextLayout}
              navigation={navigation}
              text={item.textPlain!}
              color={darkTheme.colors.text}
              theme={'dark'}
            />
          </ScrollView>
        </View>
        <Pressable
          onPress={() => dnavigation('Profile', { mode: 'a', arg: item.creator.address })}
          style={styles.creatorContainer}>
          <AppTextBody4 style={{ color: darkTheme.colors.placeholder }}>{t('moment:momentWith')}</AppTextBody4>
          <AppAvatarRenderer persona={item.creator} size={hp(2)} style={{ marginHorizontal: wp(1.5) }} />
          <AppTextHeading4 style={{ color: darkTheme.colors.placeholder }}>
            {parsePersonaLabel(item.creator, true)}
          </AppTextHeading4>
        </Pressable>
      </Animated.View>
      <Animated.View pointerEvents={'box-none'} style={[styles.rightContainer, controlAnimatedStyle]}>
        <View style={styles.rightContent}>
          {item.isLiking ? (
            <View style={styles.rightContentItem}>
              <AppActivityIndicator animating />
            </View>
          ) : (
            <View style={styles.rightContentItem}>
              <AppIconButton
                icon={item.liked ? iconMap.likeActive : iconMap.likeInactive}
                color={item.liked ? darkTheme.colors.primary : darkTheme.colors.text}
                size={wp(8)}
                onPress={() => (item.liked ? onAlreadyLiked() : onLikePress(item.id, parsePersonaLabel(item.owner)))}
              />
              <AppTextHeading3
                numberOfLines={1}
                style={[styles.textCenter, { color: item.liked ? darkTheme.colors.primary : darkTheme.colors.text }]}>
                {numberKMB(item.like, 2, true, ['K', 'M', 'B'], 10000)}
              </AppTextHeading3>
            </View>
          )}
          <View style={styles.rightContentItem}>
            <AppIconButton
              icon={iconMap.comment}
              color={darkTheme.colors.text}
              size={wp(8)}
              onPress={() => onCommentPress(item.id)}
            />
            <AppTextHeading3 numberOfLines={1} style={[styles.textCenter, { color: darkTheme.colors.text }]}>
              {numberKMB(item.comment, 2, true, ['K', 'M', 'B'], 10000)}
            </AppTextHeading3>
          </View>
          <View
            style={{
              width: wp(12),
            }}>
            <AppNFTRenderer
              nft={item.nft!}
              style={styles.nft}
              width={wp(12)}
              imageSize={'xs'}
              onPress={() => {
                dnavigation('NFTDetails', { arg: item.nft!.id, mode: 'id' });
              }}
            />
            <AppTextBody5
              numberOfLines={1}
              style={styles.nftLabel}>{`${item.nft?.symbol}#${item.nft?.serial}`}</AppTextBody5>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const AppMomentViewItem = React.forwardRef(Component);
export default AppMomentViewItem;

const makeStyles = (theme: Theme, insets: SafeAreaInsets, momentHeight: number) =>
  StyleSheet.create({
    captionBackdrop: {
      position: 'absolute',
      backgroundColor: Color('black').alpha(0.5).rgb().toString(),
      zIndex: 1,
    },
    nft: {
      borderRadius: theme.roundness,
      borderWidth: wp(0.25),
      borderColor: darkTheme.colors.text,
      overflow: 'hidden',
    },
    leftContainer: {
      position: 'absolute',
      height: hp(45),
      width: wp(80),
      marginBottom: insets.bottom,
      bottom: 0,
      left: 0,
      paddingLeft: wp(3),
      paddingBottom: hp(3),
      justifyContent: 'flex-end',
      zIndex: 2,
    },
    ownerContainer: {
      flexDirection: 'row',
    },
    ownerAvatar: {
      marginRight: wp(3),
    },
    ownerLabel: {
      color: darkTheme.colors.text,
    },
    creatorContainer: {
      flexDirection: 'row',
    },
    rightContainer: {
      position: 'absolute',
      height: hp(45),
      width: wp(20),
      marginBottom: insets.bottom,
      bottom: 0,
      right: 0,
      paddingRight: wp(3),
      paddingBottom: hp(3.5),
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      zIndex: 2,
    },
    rightContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightContentItem: {
      height: hp(8),
      width: wp(12),
      marginBottom: hp(3),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textCenter: {
      textAlign: 'center',
    },
    nftLabel: {
      marginTop: hp(0.5),
      color: darkTheme.colors.text,
      alignSelf: 'center',
    },
    momentItemContainer: {
      height: momentHeight,
      width: wp(100),
    },
    audioIndicator: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    audioIndicatorItem: {
      borderRadius: hp(5),
      backgroundColor: Color('black').alpha(0.5).rgb().string(),
    },
    gradientBottom: {
      height: hp(45),
      width: '100%',
      bottom: 0,
      position: 'absolute',
    },
  });
