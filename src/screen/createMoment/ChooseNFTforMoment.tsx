import { View, StyleSheet, FlatList, FlatListProps, RefreshControl, Platform } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader, { HEADER_HEIGHT_COMPACT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { useTranslation } from 'react-i18next';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { getProfileInitialMomentSlot, getProfileMomentSlot } from 'enevti-app/service/enevti/profile';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import AppListItem, { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from 'enevti-app/components/molecules/list/AppListItem';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import utilityToLabel from 'enevti-app/utils/format/utilityToLabel';
import { useDispatch, useSelector } from 'react-redux';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { PROFILE_MOMENT_SLOT_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';
import AppRadioButton from 'enevti-app/components/atoms/form/AppRadioButton';
import AppCameraGalleryPicker from 'enevti-app/components/organism/picker/AppCameraGalleryPicker';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { openVideoEditor } from 'enevti-app/utils/editor/openVideoEditor';
import AppResponseView from 'enevti-app/components/organism/view/AppResponseView';
import { MOMENT_MAXIMUM_DURATION } from 'enevti-app/utils/constant/moment';
import { handleError } from 'enevti-app/utils/error/handle';
import { setCreateMomentQueue } from 'enevti-app/store/slices/queue/moment/create';
import { getFileExtensionFromPath } from 'enevti-app/utils/mime/getFileExtension';
import RNFS from 'react-native-fs';
import * as mime from 'react-native-mime-types';
import { createThumbnail } from 'react-native-create-thumbnail';
import { Image } from 'react-native-compressor';

const MOMENT_SLOT_ITEM_HEIGHT = 9;
type Props = StackScreenProps<RootStackParamList, 'ChooseNFTforMoment'>;
const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<NFTBase>>(FlatList);

export default function ChooseNFTforMoment({ navigation }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const nftListRef = useAnimatedRef<FlatList>();
  const myPersona = useSelector(selectMyPersonaCache);
  const abortController = React.useRef<AbortController>();
  const selectedNFTRef = React.useRef<NFTBase>();
  const [selectedNFT, setSelectedNFT] = React.useState<string>('');
  const [momentSlot, setMomentSlot] = React.useState<NFTBase[]>();
  const [momentSlotPagination, setMomentSlotPagination] = React.useState<PaginationStore>();
  const [pickerVisible, setPickerVisible] = React.useState<boolean>(false);
  const [responseCode, setResponseCode] = React.useState<number>(0);
  const progressViewOffset = React.useMemo(
    () => hp(HEADER_HEIGHT_COMPACT_PERCENTAGE * (Platform.OS === 'android' ? 2 : 1)),
    [],
  );

  const itemHeight = React.useMemo(() => hp(MOMENT_SLOT_ITEM_HEIGHT + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE), []);

  const keyExtractor = React.useCallback((item: NFTBase) => item.id, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: NFTBase }) => (
      <AppListItem
        style={styles.momentSlotItem}
        leftContent={<AppNFTRenderer imageSize={'s'} nft={item} width={wp('13%')} style={styles.nftRenderer} />}
        rightContent={
          <View style={styles.momentSlotRightContent}>
            <AppRadioButton
              value={item.id}
              checked={selectedNFT}
              onPress={id => {
                setSelectedNFT(id);
                selectedNFTRef.current = item;
              }}
            />
          </View>
        }
        onPress={() => {
          setSelectedNFT(item.id);
          selectedNFTRef.current = item;
        }}>
        <AppTextHeading3 numberOfLines={1}>{`${item.symbol}#${item.serial}`}</AppTextHeading3>
        <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
          {utilityToLabel(item.utility)}
        </AppTextBody4>
      </AppListItem>
    ),
    [styles.momentSlotItem, styles.nftRenderer, styles.momentSlotRightContent, selectedNFT, theme.colors.placeholder],
  );

  const listFooter = React.useMemo(
    () => (
      <View>
        {momentSlot &&
        momentSlotPagination !== undefined &&
        momentSlotPagination.version !== momentSlot.length &&
        momentSlot.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
      </View>
    ),
    [momentSlot, momentSlotPagination],
  );

  const onLoad = React.useCallback(async () => {
    const momentSlotResponse = await getProfileInitialMomentSlot(myPersona.address);
    if (momentSlotResponse.status === 200) {
      setMomentSlot(momentSlotResponse.data.data);
      setMomentSlotPagination({
        checkpoint: momentSlotResponse.data.checkpoint,
        version: momentSlotResponse.data.version,
      });
    }
    setResponseCode(momentSlotResponse.status);
  }, [myPersona.address]);

  const onLoadMore = React.useCallback(async () => {
    if (momentSlot && momentSlotPagination && momentSlot.length !== momentSlotPagination.version) {
      const momentSlotResponse = await getProfileMomentSlot(
        myPersona.address,
        momentSlotPagination.checkpoint,
        PROFILE_MOMENT_SLOT_RESPONSE_LIMIT,
        momentSlotPagination.version,
        abortController.current?.signal,
      );
      if (momentSlotResponse.status === 200) {
        setMomentSlot(old => (old !== undefined ? [...old, ...momentSlotResponse.data.data] : undefined));
      }
      setResponseCode(momentSlotResponse.status);
    }
  }, [momentSlot, momentSlotPagination, myPersona.address]);

  const onRefresh = React.useCallback(async () => {
    dispatch(showModalLoader());
    await onLoad();
    dispatch(hideModalLoader());
  }, [dispatch, onLoad]);

  const onNFTSelected = React.useCallback(() => {
    setPickerVisible(old => !old);
  }, []);

  const onPickerDismissed = React.useCallback(() => {
    setPickerVisible(false);
  }, []);

  const onVideoEditorSuccess = React.useCallback(
    async (data: string) => {
      try {
        const thumbnail = await createThumbnail({ url: data, timeStamp: 0 });
        const thumbnailCompressed = await Image.compress(thumbnail.path, {
          compressionMethod: 'auto',
        });
        const thumbnailCompressedSize = (await RNFS.stat(thumbnailCompressed)).size;
        const dataSize = (await RNFS.stat(data)).size;
        dispatch(
          setCreateMomentQueue({
            nft: selectedNFTRef.current,
            data,
            dataMime: mime.lookup(data) as string,
            dataExtension: getFileExtensionFromPath(data),
            dataSize,
            dataProtocol: 'ipfs',
            cover: thumbnailCompressed,
            coverMime: thumbnail.mime,
            coverExtension: getFileExtensionFromPath(thumbnailCompressed),
            coverSize: thumbnailCompressedSize,
            coverProtocol: 'ipfs',
          }),
        );
        navigation.replace('CreateMoment', { normal: true });
      } catch (err) {
        handleError(err);
      }
    },
    [dispatch, navigation],
  );

  const onVideoEditorFailed = React.useCallback((err: any) => {
    handleError(err);
  }, []);

  const onPickerPicked = React.useCallback(
    (video: ImageOrVideo) => {
      openVideoEditor({
        navigation,
        source: video.path,
        onSuccess: onVideoEditorSuccess,
        onFailed: onVideoEditorFailed,
        duration: MOMENT_MAXIMUM_DURATION,
      });
    },
    [navigation, onVideoEditorFailed, onVideoEditorSuccess],
  );

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={onRefresh} progressViewOffset={progressViewOffset} />,
    [onRefresh, progressViewOffset],
  );

  React.useEffect(() => {
    abortController.current = new AbortController();
    onLoad();
    return () => {
      abortController.current && abortController.current.abort();
    };
  }, [onLoad]);

  return (
    <AppView
      withModal
      withPayment
      withLoader
      navigation={navigation}
      edges={['bottom', 'left', 'right']}
      headerOffset={insets.top}
      header={
        <AppHeader compact back backIcon={iconMap.close} backIconSize={23} navigation={navigation} title={' '} />
      }>
      {momentSlot !== undefined ? (
        <AppResponseView
          onReload={onRefresh}
          progressViewOffset={progressViewOffset}
          status={responseCode}
          style={styles.container}>
          <AnimatedFlatList
            ref={nftListRef}
            keyExtractor={keyExtractor}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            getItemLayout={getItemLayout}
            data={momentSlot}
            renderItem={renderItem}
            refreshControl={refreshControl}
            ListHeaderComponent={
              <AppHeaderWizard
                title={t('createMoment:addMoment')}
                description={t('createMoment:addMomentDescription')}
                style={styles.header}
                memoKey={[]}
              />
            }
            ListFooterComponent={listFooter}
            onEndReachedThreshold={0.1}
            onEndReached={onLoadMore}
          />
          <View style={styles.actionContainer}>
            <View style={{ height: hp('2%') }} />
            <AppPrimaryButton disabled={selectedNFT === ''} onPress={onNFTSelected} style={styles.actionButton}>
              {selectedNFT === '' ? t('createMoment:pleaseSelectNFT') : t('createMoment:attachToThis')}
            </AppPrimaryButton>
            <View style={{ height: Platform.OS === 'ios' ? undefined : hp('2%') }} />
          </View>
          <AppCameraGalleryPicker
            type={['videoCamera', 'videoGallery']}
            visible={pickerVisible}
            onSelected={onPickerPicked}
            onDismiss={onPickerDismissed}
          />
        </AppResponseView>
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating />
        </View>
      )}
    </AppView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    momentSlotRightContent: {
      justifyContent: 'center',
    },
    nftRenderer: {
      width: wp('13%'),
      marginRight: wp('2%'),
      alignSelf: 'center',
      borderRadius: wp('13%'),
      overflow: 'hidden',
    },
    momentSlotItem: {
      height: hp(MOMENT_SLOT_ITEM_HEIGHT),
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
    header: {
      flex: 0,
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
      marginBottom: hp('3%'),
    },
    scrollContainer: {
      zIndex: -9,
    },
    actionContainer: {
      backgroundColor: theme.colors.background,
      width: '100%',
    },
    actionButton: {
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
  });
