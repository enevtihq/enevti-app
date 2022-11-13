import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { getBuiltInNFTTemplate } from 'enevti-app/service/enevti/template';
import { NFTTemplateAsset } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import Carousel from 'react-native-snap-carousel';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import { makeDummyNFT } from 'enevti-app/utils/dummy/nft';
import { useDispatch, useSelector } from 'react-redux';
import { clearCreateNFTQueueType, selectCreateNFTTypeQueue } from 'enevti-app/store/slices/queue/nft/create/type';
import {
  clearCreateNFTOneKindQueue,
  selectCreateNFTOneKindQueue,
  setCreateNFTOneKindChosenTemplate,
} from 'enevti-app/store/slices/queue/nft/create/onekind';
import {
  selectCreateNFTPackQueue,
  setCreateNFTPackChosenTemplate,
} from 'enevti-app/store/slices/queue/nft/create/pack';
import { shuffleArray } from 'enevti-app/utils/primitive/array';
import DropShadow from 'react-native-drop-shadow';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import { setCreateNFTQueueRoute } from 'enevti-app/store/slices/queue/nft/create/route';
import { cleanTMPImage } from 'enevti-app/service/enevti/nft';

type Props = StackScreenProps<RootStackParamList, 'ChooseNFTTemplate'>;

export default function ChooseNFTTemplate({ navigation, route }: Props) {
  const { mode } = route.params;
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const dispatch = useDispatch();

  const [dataUri, setDataUri] = React.useState<string>('');
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [dummyNFT, setDummyNFT] = React.useState<NFTBase>();

  const type = useSelector(selectCreateNFTTypeQueue);
  const oneKindQueue = useSelector(selectCreateNFTOneKindQueue);
  const packQueue = useSelector(selectCreateNFTPackQueue);

  const builtInTemplate = getBuiltInNFTTemplate();
  const placeholderTemplate: NFTTemplateAsset = {
    id: 'create',
    name: t('createNFT:createTemplate'),
    description: t('createNFT:createTemplateDescription'),
    data: { main: [], thumbnail: [] },
  };
  const template = builtInTemplate.concat(placeholderTemplate);

  const itemWidth = React.useMemo(() => wp('85%', insets), [insets]);
  const sliderWidth = React.useMemo(() => wp('100%', insets), [insets]);

  const renderItem = React.useCallback(
    ({ item }: { index?: number; item: NFTTemplateAsset }) =>
      item.id === 'create' ? (
        <DropShadow style={[styles.templateItem, { width: itemWidth, height: itemWidth }]}>
          <View
            style={[
              styles.comingSoonBox,
              {
                width: itemWidth,
                height: itemWidth,
              },
            ]}>
            <AppTextHeading1>Coming Soon</AppTextHeading1>
          </View>
        </DropShadow>
      ) : dummyNFT ? (
        <DropShadow style={[styles.templateItem, { width: itemWidth }]}>
          <AppNFTRenderer
            nft={Object.assign({}, dummyNFT, {
              template: item.data,
            })}
            width={itemWidth}
            dataUri={dataUri}
          />
        </DropShadow>
      ) : null,
    [itemWidth, dataUri, styles.templateItem, dummyNFT, styles.comingSoonBox],
  );

  const onSnapToItem = (index: number) => {
    setActiveIndex(index);
  };

  const onContinue = () => {
    if (type === 'onekind') {
      dispatch(setCreateNFTOneKindChosenTemplate(template[activeIndex]));
      dispatch(setCreateNFTQueueRoute('CreateOneKindContract'));
      if (mode === 'normal') {
        navigation.replace('CreateOneKindContract', { normal: true });
      } else if (mode === 'change') {
        navigation.goBack();
      }
    } else if (type === 'pack') {
      dispatch(setCreateNFTPackChosenTemplate(template[activeIndex]));
      // dispatch route to pack contract
      // navigate to pack contract screen
    }
  };

  React.useEffect(() => {
    if (type === 'onekind') {
      setDataUri(oneKindQueue.data.uri);
    } else if (type === 'pack') {
      setDataUri(shuffleArray(packQueue.data).uri);
    }
    setDummyNFT(makeDummyNFT('pack'));
  }, [oneKindQueue.data.uri, packQueue.data, type]);

  const onBack = React.useCallback(() => {
    dispatch(clearCreateNFTOneKindQueue());
    dispatch(clearCreateNFTQueueType());
    cleanTMPImage();
  }, [dispatch]);

  return (
    <AppView>
      <AppHeaderWizard
        back
        backIcon={mode === 'change' ? undefined : iconMap.close}
        onBack={onBack}
        navigation={navigation}
        title={t('createNFT:chooseNFTTemplateTitle')}
        description={t('createNFT:chooseNFTTemplateDescription')}
        style={styles.header}
      />

      <View style={styles.templateCarousel}>
        <Carousel
          enableMomentum={true}
          decelerationRate={'fast'}
          data={template}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={onSnapToItem}
        />
        <AppListItem
          containerStyle={{ marginHorizontal: wp('12.5%', insets) }}
          style={{ paddingHorizontal: wp('5%', insets) }}
          rightContent={
            template[activeIndex].id !== 'create' ? (
              <AppIconButton
                icon={iconMap.edit}
                onPress={() =>
                  dispatch(
                    showSnackbar({
                      mode: 'info',
                      text: 'Soon you will also be able to edit existing template',
                    }),
                  )
                }
                style={styles.templateEdit}
              />
            ) : null
          }>
          <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
            {template[activeIndex].name}
          </AppTextHeading3>
          <AppTextBody4 numberOfLines={2} style={{ color: theme.colors.placeholder }}>
            {template[activeIndex].description}
          </AppTextBody4>
        </AppListItem>
      </View>

      <View style={styles.actionContainer}>
        <AppPrimaryButton
          style={styles.continueButton}
          disabled={template[activeIndex].id === 'create'}
          onPress={onContinue}>
          {template[activeIndex].id === 'create'
            ? t('createNFT:createTemplateButton')
            : t('createNFT:chooseNFTTemplateContinue')}
        </AppPrimaryButton>
        <View style={{ height: hp('2%', insets) }} />
      </View>
    </AppView>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
    },
    actionContainer: {
      marginTop: hp('6%', insets),
    },
    continueButton: {
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    templateItem: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme.dark ? 1 : 0.3,
      shadowRadius: theme.dark ? 10 : 7,
    },
    templateCarousel: {
      flex: 1,
      marginTop: hp('6%', insets),
    },
    templateEdit: {
      alignSelf: 'center',
      marginRight: -wp('1%', insets),
    },
    comingSoonBox: {
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
