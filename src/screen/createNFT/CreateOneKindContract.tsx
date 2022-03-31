import React from 'react';
import { StyleSheet, View, Keyboard, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import DocumentPicker from 'react-native-document-picker';
import { FormikProps, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCreateNFTOneKindQueue,
  createNFTOneKindQueueInitialState,
  selectCreateNFTOneKindQueue,
  setCreateNFTOneKindState,
  setCreateNFTOneKindStatus,
  setCreateNFTOneKindURI,
} from '../../store/slices/queue/nft/create/onekind';
import * as Yup from 'yup';

import { Theme } from '../../theme/default';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../../navigation';
import AppFormTextInputWithError, {
  AppFormTextInputWithErrorProps,
} from '../../components/molecules/AppFormTextInputWithError';
import AppPrimaryButton from '../../components/atoms/button/AppPrimaryButton';
import AppView from '../../components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';
import AppIconComponent, {
  iconMap,
} from '../../components/atoms/icon/AppIconComponent';
import { ScrollView } from 'react-native-gesture-handler';
import AppTextBody3 from '../../components/atoms/text/AppTextBody3';
import { OneKindContractForm } from '../../types/screen/CreateOneKindContract';
import AppCoinChipsPicker from '../../components/organism/AppCoinChipsPicker';
import {
  cleanTMPImage,
  isNameAvailable,
  isSymbolAvailable,
} from '../../service/enevti/nft';
import AppUtilityPicker from '../../components/organism/picker/AppUtilityPicker';
import AppRecurringPicker from '../../components/organism/picker/AppRecurringPicker.tsx';
import AppDateMonthPicker from '../../components/organism/datePicker/AppDateMonthPicker';
import AppDayPicker from '../../components/organism/datePicker/AppDayPicker';
import AppDatePicker from '../../components/organism/datePicker/AppDatePicker';
import AppDateMonthYearPicker from '../../components/organism/datePicker/AppDateMonthYearPicker';
import AppHourMinutePicker from '../../components/organism/datePicker/AppHourMinutePicker';
import AppRedeemLimitPicker from '../../components/organism/picker/AppRedeemLimitPicker';
import AppContentPicker from '../../components/organism/picker/AppContentPicker';
import AppMintingPeriodPicker from '../../components/organism/picker/AppMintingPeriodPicker';
import AppAccordion from '../../components/atoms/accordion/AppAccordion';
import { NFTBase } from '../../types/nft';
import { makeDummyNFT } from '../../utils/dummy/nft';
import AppNFTRenderer from '../../components/molecules/nft/AppNFTRenderer';
import AppInfoMessage from '../../components/molecules/AppInfoMessage';
import AppQuaternaryButton from '../../components/atoms/button/AppQuaternaryButton';
import AppTextBody4 from '../../components/atoms/text/AppTextBody4';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import AppCameraGalleryPicker from '../../components/organism/picker/AppCameraGalleryPicker';
import AppHeader from '../../components/atoms/view/AppHeader';
import AppMenuContainer from '../../components/atoms/menu/AppMenuContainer';
import AppSecondaryButton from '../../components/atoms/button/AppSecondaryButton';
import { clearCreateNFTQueueType } from '../../store/slices/queue/nft/create/type';
import { clearCreateNFTQueueRoute } from '../../store/slices/queue/nft/create/route';
import usePaymentCallback from '../../utils/hook/usePaymentCallback';
import {
  hideModalLoader,
  showModalLoader,
} from '../../store/slices/ui/global/modalLoader';
import { showSnackbar } from '../../store/slices/ui/global/snackbar';
import { payCreateNFTOneKind } from '../../store/middleware/thunk/queue/nft/create/payCreateNFTOneKind';

type Props = StackScreenProps<RootStackParamList, 'CreateOneKindContract'>;

const setMultipleFieldValue = (
  formik: FormikProps<OneKindContractForm & { initialDirty: string }>,
  keys: (keyof OneKindContractForm)[],
  initial: boolean = false,
  shouldValidate: boolean = false,
  value?: string | number,
) => {
  for (let i = 0; i < keys.length; i++) {
    if (initial) {
      formik.setFieldValue(
        keys[i],
        createNFTOneKindQueueInitialState.state[keys[i]],
        shouldValidate,
      );
    } else {
      formik.setFieldValue(keys[i], value, shouldValidate);
    }
  }
};

const setMultipleFieldTouched = (
  formik: FormikProps<OneKindContractForm & { initialDirty: string }>,
  keys: (keyof OneKindContractForm)[],
  value: boolean,
  shouldValidate: boolean = false,
) => {
  for (let i = 0; i < keys.length; i++) {
    formik.setFieldTouched(keys[i], value, shouldValidate);
  }
};

const resetRedeemTimeKeyFields = (
  formik: FormikProps<OneKindContractForm & { initialDirty: string }>,
) => {
  setMultipleFieldValue(formik, redeemTimeKey, true);
  setMultipleFieldTouched(formik, redeemTimeKey, false);
};

const redeemTimeKey: (keyof OneKindContractForm)[] = [
  'timeYear',
  'timeMonth',
  'timeDay',
  'timeDate',
  'fromHour',
  'fromMinute',
  'untilHour',
  'untilMinute',
  'redeemLimitOption',
  'redeemLimit',
];

const contentKey: (keyof OneKindContractForm)[] = [
  'contentName',
  'contentSize',
  'contentType',
  'contentUri',
];

const coverKey: (keyof OneKindContractForm)[] = [
  'coverName',
  'coverSize',
  'coverType',
  'coverUri',
];

export default function CreateOneKindContract({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const oneKindContractStore = useSelector(selectCreateNFTOneKindQueue);
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const timezoneOffset = React.useMemo(
    () => new Date().getTimezoneOffset(),
    [],
  );
  const itemWidth = React.useMemo(() => wp('90%', insets), [insets]);
  const closeMenuSnapPoints = React.useMemo(() => ['42%'], []);

  const nameInput = React.useRef<TextInput>();
  const descriptionInput = React.useRef<TextInput>();
  const symbolInput = React.useRef<TextInput>();
  const priceInput = React.useRef<TextInput>();
  const quantityInput = React.useRef<TextInput>();
  const mintingPeriodInput = React.useRef<TextInput>();
  const redeemLimitInput = React.useRef<TextInput>();
  const creatorRoyaltyInput = React.useRef<TextInput>();
  const stakerRoyaltyInput = React.useRef<TextInput>();

  const canGoBack = React.useRef<boolean>(false);
  const [dummyNFT, setDummyNFT] = React.useState<NFTBase>(() =>
    Object.assign({}, makeDummyNFT('onekind'), {
      template: oneKindContractStore.choosenTemplate.data,
    }),
  );
  const [oneKindSheetVisible, setOneKindSheetVisible] =
    React.useState<boolean>(false);
  const [closeMenuVisible, setCloseMenuVisible] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activePrice, setActivePrice] = React.useState<boolean>(false);
  const [identityExpanded, setIdentityExpanded] = React.useState<boolean>(true);
  const [mintingExpanded, setMintingExpanded] = React.useState<boolean>(true);
  const [utilityExpanded, setUtilityExpanded] = React.useState<boolean>(true);
  const [royaltyExpanded, setRoyaltyExpanded] = React.useState<boolean>(true);
  const [previewExpanded, setPreviewExpanded] = React.useState<boolean>(true);

  const validationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('form:required')),
        description: Yup.string().required(t('form:required')),
        symbol: Yup.string()
          .matches(/^[A-Z]+$/, t('form:upercase'))
          .required(t('form:required')),
        priceAmount: Yup.string().required(t('form:required')),
        quantity: Yup.number()
          .transform(value => (isNaN(value) ? undefined : value))
          .moreThan(0)
          .required(t('form:required')),
        mintingExpireOption: Yup.string().required(t('form:required')),
        mintingExpire: Yup.number()
          .transform(value => (isNaN(value) ? undefined : value))
          .min(0, t('form:greaterEqualZero'))
          .required(t('form:required')),
        utility: Yup.string().required(t('form:required')),
        contentUri: Yup.string().when('utility', {
          is: 'content',
          then: Yup.string().required(),
        }),
        recurring: Yup.string().when('utility', {
          is: (val: string) => val !== 'content',
          then: Yup.string().required(),
        }),
        timeDay: Yup.number().when('recurring', {
          is: (val: string) => val === 'every-week' || val === 'once',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        timeDate: Yup.number().when('recurring', {
          is: (val: string) => val === 'every-month' || val === 'once',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        timeMonth: Yup.number().when('recurring', {
          is: (val: string) => val === 'every-year' || val === 'once',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        timeYear: Yup.number().when('recurring', {
          is: 'once',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        fromHour: Yup.number().when('utility', {
          is: (val: string) => val !== 'content',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        untilHour: Yup.number().when('utility', {
          is: (val: string) => val !== 'content',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        redeemLimitOption: Yup.string().when('recurring', {
          is: (val: string) => val === 'once' || val === 'anytime',
          otherwise: Yup.string().required(),
        }),
        redeemLimit: Yup.string().when('redeemLimitOption', {
          is: 'fixed',
          then: Yup.number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(0, t('form:greaterEqualZero')),
        }),
        royaltyOrigin: Yup.number()
          .transform(value => (isNaN(value) ? undefined : value))
          .min(0, t('form:greaterEqualZero')),
        royaltyStaker: Yup.number()
          .transform(value => (isNaN(value) ? undefined : value))
          .min(0, t('form:greaterEqualZero')),
      }),
    [t],
  );

  const formikProps = useFormik({
    initialValues: { ...oneKindContractStore.state, initialDirty: '' },
    initialStatus: oneKindContractStore.status,
    onSubmit: async values => {
      Keyboard.dismiss();
      setIsLoading(true);
      await handleFormSubmit(values);
    },
    validationSchema: validationSchema,
  });

  const handleFormSubmit = async (values: OneKindContractForm) => {
    const payload = Object.assign({}, oneKindContractStore, { state: values });
    dispatch(payCreateNFTOneKind(payload));
    setIsLoading(false);
  };

  const discardFormState = React.useCallback(() => {
    dispatch(clearCreateNFTOneKindQueue());
    dispatch(clearCreateNFTQueueType());
    dispatch(clearCreateNFTQueueRoute());
    cleanTMPImage();
    canGoBack.current = true;
    setCloseMenuVisible(false);
    navigation.goBack();
  }, [dispatch, navigation]);

  const saveFormState = React.useCallback(() => {
    dispatch(setCreateNFTOneKindState(formikProps.values));
    dispatch(setCreateNFTOneKindStatus(formikProps.status));
    canGoBack.current = true;
    setCloseMenuVisible(false);
    navigation.goBack();
  }, [dispatch, formikProps.values, formikProps.status, navigation]);

  const paymentProcessCallback = React.useCallback(() => {
    dispatch(showModalLoader());
  }, [dispatch]);

  const paymentSuccessCallback = React.useCallback(() => {
    dispatch(hideModalLoader());
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
    discardFormState();
  }, [dispatch, discardFormState, t]);

  const paymentErrorCallback = React.useCallback(
    () => dispatch(hideModalLoader()),
    [dispatch],
  );

  usePaymentCallback({
    onProcess: paymentProcessCallback,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

  const nextRefCallback = React.useCallback(
    nextref => () => nextref && nextref.current?.focus(),
    [],
  );

  const commonOnEndEditing = React.useCallback(
    (key, formik) => (e: any) =>
      formik.setFieldValue(key, e.nativeEvent.text, true),
    [],
  );

  const commonOnBlur = React.useCallback(
    (key, formik) => () => formik.setFieldTouched(key),
    [],
  );

  const onDeleteCoverPicker = React.useCallback(() => {
    setMultipleFieldValue(formikProps, coverKey, true);
    setMultipleFieldTouched(formikProps, coverKey, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedCoverPicker = React.useCallback(item => {
    formikProps.setFieldValue('coverName', item.name, false);
    formikProps.setFieldValue('coverSize', item.size, false);
    formikProps.setFieldValue('coverType', item.type, false);
    formikProps.setFieldValue('coverUri', item.uri, false);
    setMultipleFieldTouched(formikProps, coverKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocusPriceInput = React.useCallback(() => setActivePrice(true), []);

  const onBlurPriceInput = React.useCallback(() => {
    !formikProps.touched.priceAmount &&
      formikProps.setFieldTouched('priceAmount');
    setActivePrice(false);
  }, [formikProps]);

  const onSelectedMintingPeriodPicker = React.useCallback(item => {
    if (item.value === 'no-limit') {
      formikProps.setFieldValue('mintingExpire', 0, true);
    }
    formikProps.setFieldValue('mintingExpireOption', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedUtilityPicker = React.useCallback(item => {
    if (item.value === 'content') {
      formikProps.setFieldValue('recurring', 'anytime', true);
      resetRedeemTimeKeyFields(formikProps);
    } else {
      setMultipleFieldValue(formikProps, contentKey, true, true);
      setMultipleFieldTouched(formikProps, contentKey, false);
    }
    formikProps.setFieldValue('utility', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteContentPicker = React.useCallback(() => {
    setMultipleFieldValue(formikProps, contentKey, true, true);
    setMultipleFieldTouched(formikProps, contentKey, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedContentPicker = React.useCallback(item => {
    formikProps.setFieldValue('contentName', item.name, false);
    formikProps.setFieldValue('contentSize', item.size, false);
    formikProps.setFieldValue('contentType', item.type, false);
    formikProps.setFieldValue('contentUri', item.uri, true);
    setMultipleFieldTouched(formikProps, contentKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedRecurringPicker = React.useCallback(item => {
    resetRedeemTimeKeyFields(formikProps);
    if (item.value === 'every-day') {
      setMultipleFieldTouched(formikProps, ['timeDay', 'timeDate'], true);
    }
    formikProps.setFieldValue('recurring', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDayPicker = React.useCallback(value => {
    formikProps.setFieldValue('timeDay', value[0], true);
    formikProps.setFieldTouched('timeDay', true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDatePicker = React.useCallback(value => {
    formikProps.setFieldValue('timeDate', value[0], true);
    formikProps.setFieldTouched('timeDate', true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDateMonthPicker = React.useCallback(value => {
    formikProps.setFieldValue('timeMonth', value[0], true);
    formikProps.setFieldValue('timeDate', value[1], true);
    setMultipleFieldTouched(formikProps, ['timeMonth', 'timeDate'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDateMonthYearPicker = React.useCallback(value => {
    formikProps.setFieldValue('timeYear', value[0], true);
    formikProps.setFieldValue('timeMonth', value[1], true);
    formikProps.setFieldValue('timeDate', value[2], true);
    setMultipleFieldTouched(
      formikProps,
      ['timeYear', 'timeMonth', 'timeDate'],
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedHourMinutePickerStart = React.useCallback(value => {
    formikProps.setFieldValue('fromHour', value[0], true);
    formikProps.setFieldValue('fromMinute', value[1], true);
    setMultipleFieldTouched(formikProps, ['fromHour', 'fromMinute'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedHourMinutePickerEnd = React.useCallback(value => {
    formikProps.setFieldValue('untilHour', value[0], true);
    formikProps.setFieldValue('untilMinute', value[1], true);
    setMultipleFieldTouched(formikProps, ['untilHour', 'untilMinute'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedRedeemLimitPicker = React.useCallback(item => {
    if (item.value === 'no-limit') {
      formikProps.setFieldValue('redeemLimit', 0, true);
    }
    formikProps.setFieldValue('redeemLimitOption', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOneKindImagePicked = React.useCallback(
    (image: ImageOrVideo) => {
      dispatch(setCreateNFTOneKindURI(image.path));
      setOneKindSheetVisible(false);
    },
    [dispatch],
  );

  const labelHourMinutePickerStart = React.useMemo(
    () =>
      t('createNFT:redeemStartTime') +
      ` (UTC${timezoneOffset > 0 ? '-' : '+'}${(timezoneOffset * -1) / 60})`,
    [t, timezoneOffset],
  );

  const labelHourMinutePickerEnd = React.useMemo(
    () =>
      t('createNFT:redeemEndTime') +
      ` (UTC${timezoneOffset > 0 ? '-' : '+'}${(timezoneOffset * -1) / 60})`,
    [t, timezoneOffset],
  );

  const dateMonthPickerValue = React.useMemo(
    () => [formikProps.values.timeMonth, formikProps.values.timeDate],
    [formikProps.values.timeMonth, formikProps.values.timeDate],
  );

  const dayPickerValue = React.useMemo(
    () => [formikProps.values.timeDay],
    [formikProps.values.timeDay],
  );

  const datePickerValue = React.useMemo(
    () => [formikProps.values.timeDate],
    [formikProps.values.timeDate],
  );

  const dateMonthYearPickerValue = React.useMemo(
    () => [
      formikProps.values.timeYear,
      formikProps.values.timeMonth,
      formikProps.values.timeDate,
    ],
    [
      formikProps.values.timeYear,
      formikProps.values.timeMonth,
      formikProps.values.timeDate,
    ],
  );

  const hourMinuteStartValue = React.useMemo(
    () => [formikProps.values.fromHour, formikProps.values.fromMinute],
    [formikProps.values.fromHour, formikProps.values.fromMinute],
  );

  const hourMinuteEndValue = React.useMemo(
    () => [formikProps.values.untilHour, formikProps.values.untilMinute],
    [formikProps.values.untilHour, formikProps.values.untilMinute],
  );

  const contentPickerValue = React.useMemo(
    () => ({
      fileCopyUri: null,
      name: formikProps.values.contentName,
      size: formikProps.values.contentSize,
      type: formikProps.values.contentType,
      uri: formikProps.values.contentUri,
    }),
    [
      formikProps.values.contentName,
      formikProps.values.contentSize,
      formikProps.values.contentType,
      formikProps.values.contentUri,
    ],
  );

  const coverPickerValue = React.useMemo(
    () => ({
      fileCopyUri: null,
      name: formikProps.values.coverName,
      size: formikProps.values.coverSize,
      type: formikProps.values.coverType,
      uri: formikProps.values.coverUri,
    }),
    [
      formikProps.values.coverName,
      formikProps.values.coverSize,
      formikProps.values.coverType,
      formikProps.values.coverUri,
    ],
  );

  const CoinChips = React.useMemo(
    () => (
      <AppCoinChipsPicker
        active={activePrice}
        error={
          formikProps.touched.priceAmount && !!formikProps.errors.priceAmount
        }
      />
    ),
    [
      formikProps.touched.priceAmount,
      formikProps.errors.priceAmount,
      activePrice,
    ],
  );

  React.useEffect(() => {
    setDummyNFT(oldDummyNFT =>
      Object.assign({}, oldDummyNFT, {
        name: formikProps.values.name,
        symbol: formikProps.values.symbol,
        serial: 1,
        utility: formikProps.values.utility,
        template: oneKindContractStore.choosenTemplate.data,
      }),
    );
  }, [
    oneKindContractStore.choosenTemplate.data,
    formikProps.values.name,
    formikProps.values.symbol,
    formikProps.values.utility,
  ]);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (canGoBack.current) {
          setCloseMenuVisible(false);
          navigation.dispatch(e.data.action);
        } else {
          e.preventDefault();
          Keyboard.dismiss();
          setCloseMenuVisible(visible => !visible);
        }
      }),
    [navigation, canGoBack],
  );

  React.useEffect(() => {
    if (route.params === undefined) {
      formikProps.setFieldValue('initialDirty', 'dirty', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

  const commonFormInput = React.useCallback(
    (
      formik: FormikProps<OneKindContractForm & { initialDirty: string }>,
      ref: React.MutableRefObject<TextInput | undefined>,
      key: keyof OneKindContractForm,
      label: string,
      placeholder: string,
      options?: Omit<AppFormTextInputWithErrorProps, 'theme'>,
      nextref?: React.MutableRefObject<TextInput | undefined>,
    ) => (
      <AppFormTextInputWithError
        ref={ref}
        theme={paperTheme}
        dense={true}
        style={styles.formInput}
        returnKeyType={'go'}
        autoComplete={'off'}
        autoCorrect={false}
        defaultValue={formik.values[key].toString()}
        label={label}
        placeholder={placeholder}
        onBlur={commonOnBlur(key, formik)}
        errorText={formik.errors[key]}
        error={formik.touched[key] && !!formik.errors[key]}
        showError={formik.touched[key]}
        onEndEditing={commonOnEndEditing(key, formik)}
        onSubmitEditing={nextRefCallback(nextref)}
        {...options}
      />
    ),
    [
      paperTheme,
      styles.formInput,
      nextRefCallback,
      commonOnEndEditing,
      commonOnBlur,
    ],
  );

  const accordionHeader = React.useCallback(
    (icon: string, text: string) => (
      <View style={styles.accordionListView}>
        <AppIconComponent
          name={icon}
          color={theme.colors.text}
          size={20}
          style={styles.accordionIcon}
        />
        <AppTextBody3>{text}</AppTextBody3>
      </View>
    ),
    [styles.accordionIcon, styles.accordionListView, theme.colors.text],
  );

  const identityHeader = React.useMemo(
    () => accordionHeader(iconMap.identity, t('createNFT:nftIdentity')),
    [accordionHeader, t],
  );

  const identityHeaderCallback = React.useCallback(
    () => setIdentityExpanded(!identityExpanded),
    [identityExpanded],
  );

  const mintingHeader = React.useMemo(
    () =>
      accordionHeader(
        iconMap.mintingBehaviour,
        t('createNFT:nftMintingBehaviour'),
      ),
    [accordionHeader, t],
  );

  const mintingHeaderCallback = React.useCallback(
    () => setMintingExpanded(!mintingExpanded),
    [mintingExpanded],
  );

  const utilityHeader = React.useMemo(
    () => accordionHeader(iconMap.utility, t('createNFT:nftUtility')),
    [accordionHeader, t],
  );

  const utilityHeaderCallback = React.useCallback(
    () => setUtilityExpanded(!utilityExpanded),
    [utilityExpanded],
  );

  const royaltyHeader = React.useMemo(
    () => accordionHeader(iconMap.royalty, t('createNFT:nftRoyalty')),
    [accordionHeader, t],
  );

  const royaltyHeaderCallback = React.useCallback(
    () => setRoyaltyExpanded(!royaltyExpanded),
    [royaltyExpanded],
  );

  const previewHeader = React.useMemo(
    () => accordionHeader(iconMap.preview, t('createNFT:nftPreview')),
    [accordionHeader, t],
  );

  const previewHeaderCallback = React.useCallback(
    () => setPreviewExpanded(!previewExpanded),
    [previewExpanded],
  );

  const previewChangeImageOnDismiss = React.useCallback(
    () => setOneKindSheetVisible(false),
    [],
  );

  const previewChangeImageOnPress = React.useCallback(
    () => setOneKindSheetVisible(old => !old),
    [],
  );

  const previewChangeTemplateOnPress = React.useCallback(
    () =>
      navigation.navigate('ChooseNFTTemplate', {
        mode: 'change',
      }),
    [navigation],
  );

  const closeMenuOnDismiss = React.useCallback(
    () => setCloseMenuVisible(false),
    [],
  );

  return (
    <AppView
      withModal
      withPayment
      withLoader
      edges={['bottom', 'left', 'right']}
      headerOffset={insets.top}
      header={
        <AppHeader
          compact
          back
          backIcon={iconMap.close}
          backIconSize={23}
          navigation={navigation}
          title={' '}
        />
      }>
      <ScrollView style={styles.scrollContainer}>
        <AppHeaderWizard
          title={t('createNFT:setupContract')}
          description={t('createNFT:setupContractDescription')}
          style={styles.header}
          memoKey={[]}
        />

        <View style={styles.formView}>
          <AppAccordion
            expanded={identityExpanded}
            onPress={identityHeaderCallback}
            title={identityHeader}>
            <View style={{ height: hp('1%', insets) }} />
            {commonFormInput(
              formikProps,
              nameInput,
              'name',
              t('createNFT:collectionName'),
              t('createNFT:collectionNamePlaceholder'),
              {
                autoCapitalize: 'words',
                maxLength: 20,
                memoKey: ['error', 'showError'],
                errorText: !formikProps.status.nameAvailable
                  ? t('createNFT:nameUnavailable')
                  : formikProps.errors.name,
                error:
                  formikProps.touched.name &&
                  (!formikProps.status.nameAvailable ||
                    !!formikProps.errors.name),
                onEndEditing: async e => {
                  const text = e.nativeEvent.text;
                  formikProps.setFieldValue('name', text, true);
                  const nameAvailable = await isNameAvailable(text);
                  formikProps.setStatus({
                    ...formikProps.status,
                    nameAvailable,
                  });
                },
              },
              descriptionInput,
            )}
            {commonFormInput(
              formikProps,
              descriptionInput,
              'description',
              t('createNFT:collectionDescription'),
              t('createNFT:collectionDescriptionPlaceholder'),
              {
                multiline: true,
                numberOfLines: 5,
                maxLength: 280,
                memoKey: ['error', 'showError'],
              },
            )}
            {commonFormInput(
              formikProps,
              symbolInput,
              'symbol',
              t('createNFT:collectionSymbol'),
              t('createNFT:collectionSymbolPlaceholder'),
              {
                autoCapitalize: 'characters',
                maxLength: 10,
                memoKey: ['error', 'showError'],
                errorText: !formikProps.status.symbolAvailable
                  ? t('createNFT:symbolUnavailable')
                  : formikProps.errors.symbol,
                error:
                  formikProps.touched.symbol &&
                  (!formikProps.status.symbolAvailable ||
                    !!formikProps.errors.symbol),
                onEndEditing: async e => {
                  const text = e.nativeEvent.text;
                  formikProps.setFieldValue('symbol', text, true);
                  const symbolAvailable = await isSymbolAvailable(text);
                  formikProps.setStatus({
                    ...formikProps.status,
                    symbolAvailable,
                  });
                },
              },
            )}
            <View style={{ height: hp('0.5%', insets) }} />
            <AppContentPicker
              title={t('createNFT:selectCover')}
              description={t('createNFT:selectCoverDescription')}
              type={DocumentPicker.types.images}
              value={coverPickerValue}
              onDelete={onDeleteCoverPicker}
              onSelected={onSelectedCoverPicker}
            />
          </AppAccordion>

          <AppAccordion
            expanded={mintingExpanded}
            onPress={mintingHeaderCallback}
            title={mintingHeader}>
            <View style={{ height: hp('1%', insets) }} />
            {commonFormInput(
              formikProps,
              priceInput,
              'priceAmount',
              t('createNFT:collectionPrice'),
              t('createNFT:collectionPricePlaceholder'),
              {
                onFocus: onFocusPriceInput,
                onBlur: onBlurPriceInput,
                keyboardType: 'number-pad',
                hideMaxLengthIndicator: true,
                maxLength: 13,
                rowEndComponent: CoinChips,
                memoKey: ['error', 'showError', 'rowEndComponent'],
              },
              quantityInput,
            )}
            {commonFormInput(
              formikProps,
              quantityInput,
              'quantity',
              t('createNFT:collectionQuantity'),
              t('createNFT:collectionQuantityPlaceholder'),
              {
                memoKey: ['error', 'showError'],
                keyboardType: 'number-pad',
                errorText: formikProps.errors.quantity
                  ? parseFloat(formikProps.values.quantity) <= 0
                    ? t('form:greaterThanZero')
                    : t('form:required')
                  : '',
              },
            )}
            <AppMintingPeriodPicker
              label={t('createNFT:mintingPeriodLimit')}
              value={formikProps.values.mintingExpireOption}
              onSelected={onSelectedMintingPeriodPicker}
            />
            {formikProps.values.mintingExpireOption === 'fixed'
              ? commonFormInput(
                  formikProps,
                  mintingPeriodInput,
                  'mintingExpire',
                  t('createNFT:collectionMintingExpire'),
                  t('createNFT:collectionMintingExpirePlaceholder'),
                  {
                    memoKey: ['error', 'showError'],
                    keyboardType: 'number-pad',
                  },
                )
              : null}
          </AppAccordion>

          <AppAccordion
            expanded={utilityExpanded}
            onPress={utilityHeaderCallback}
            title={utilityHeader}>
            <View style={{ height: hp('1%', insets) }} />
            <AppUtilityPicker
              value={formikProps.values.utility}
              onSelected={onSelectedUtilityPicker}
            />

            <View style={{ height: hp('1%', insets) }} />

            {formikProps.values.utility &&
            formikProps.values.utility === 'content' ? (
              <AppContentPicker
                title={t('createNFT:selectContent')}
                description={t('createNFT:selectContentDescription')}
                value={contentPickerValue}
                onDelete={onDeleteContentPicker}
                onSelected={onSelectedContentPicker}
              />
            ) : null}

            {formikProps.values.utility &&
            formikProps.values.utility !== 'content' ? (
              <>
                <AppRecurringPicker
                  value={formikProps.values.recurring}
                  onSelected={onSelectedRecurringPicker}
                />
                <View style={{ height: hp('1%', insets) }} />
              </>
            ) : null}

            {formikProps.values.recurring === 'every-week' ? (
              <AppDayPicker
                label={t('createNFT:redeemDay')}
                onSelected={onSelectedDayPicker}
                value={dayPickerValue}
              />
            ) : formikProps.values.recurring === 'every-month' ? (
              <AppDatePicker
                label={t('createNFT:redeemDate')}
                onSelected={onSelectedDatePicker}
                value={datePickerValue}
              />
            ) : formikProps.values.recurring === 'every-year' ? (
              <AppDateMonthPicker
                label={t('createNFT:redeemMonthAndDate')}
                onSelected={onSelectedDateMonthPicker}
                value={dateMonthPickerValue}
              />
            ) : formikProps.values.recurring === 'once' ? (
              <AppDateMonthYearPicker
                label={t('createNFT:redeemYearMonthAndaDate')}
                onSelected={onSelectedDateMonthYearPicker}
                value={dateMonthYearPickerValue}
              />
            ) : null}

            {formikProps.values.recurring !== 'anytime' &&
            (formikProps.touched.timeDay || formikProps.touched.timeDate) ? (
              <AppHourMinutePicker
                label={labelHourMinutePickerStart}
                onSelected={onSelectedHourMinutePickerStart}
                value={hourMinuteStartValue}
              />
            ) : null}

            {formikProps.values.recurring !== 'anytime' &&
            formikProps.touched.fromHour &&
            formikProps.touched.fromMinute ? (
              <AppHourMinutePicker
                label={labelHourMinutePickerEnd}
                onSelected={onSelectedHourMinutePickerEnd}
                value={hourMinuteEndValue}
              />
            ) : null}

            {formikProps.touched.untilHour &&
            formikProps.touched.untilMinute &&
            formikProps.values.recurring !== 'once' &&
            formikProps.values.recurring !== 'anytime' ? (
              <AppRedeemLimitPicker
                label={t('createNFT:redeemLimit')}
                value={formikProps.values.redeemLimitOption}
                onSelected={onSelectedRedeemLimitPicker}
              />
            ) : null}

            {formikProps.values.redeemLimitOption === 'fixed'
              ? commonFormInput(
                  formikProps,
                  redeemLimitInput,
                  'redeemLimit',
                  t('createNFT:redeemLimitCount'),
                  t('createNFT:redeemLimitCountPlaceholder'),
                  {
                    memoKey: ['error', 'showError'],
                    keyboardType: 'number-pad',
                  },
                )
              : null}
          </AppAccordion>

          <AppAccordion
            expanded={royaltyExpanded}
            onPress={royaltyHeaderCallback}
            title={royaltyHeader}>
            <View style={{ height: hp('1%', insets) }} />
            {commonFormInput(
              formikProps,
              creatorRoyaltyInput,
              'royaltyOrigin',
              t('createNFT:collectionRoyaltyOrigin'),
              t('createNFT:collectionRoyaltyOriginDescription'),
              {
                memoKey: ['error', 'showError'],
                keyboardType: 'number-pad',
              },
              stakerRoyaltyInput,
            )}
            {commonFormInput(
              formikProps,
              stakerRoyaltyInput,
              'royaltyStaker',
              t('createNFT:collectionRoyaltyStaker'),
              t('createNFT:collectionRoyaltyStakerDescription'),
              {
                memoKey: ['error', 'showError'],
                keyboardType: 'number-pad',
              },
            )}
          </AppAccordion>

          <AppAccordion
            expanded={previewExpanded}
            onPress={previewHeaderCallback}
            title={previewHeader}>
            <View style={{ height: hp('1%', insets) }} />
            {formikProps.values.name &&
            formikProps.values.symbol &&
            formikProps.values.utility ? (
              <View style={styles.formInput}>
                <AppNFTRenderer
                  nft={dummyNFT}
                  width={itemWidth}
                  dataUri={oneKindContractStore.data.uri}
                />
                <View style={styles.previewAction}>
                  <AppQuaternaryButton
                    box
                    onPress={previewChangeImageOnPress}
                    style={styles.previewActionButtonItem}>
                    <AppTextBody4>{t('createNFT:changeImage')}</AppTextBody4>
                  </AppQuaternaryButton>
                  <AppCameraGalleryPicker
                    memoKey={['visible']}
                    visible={oneKindSheetVisible}
                    onDismiss={previewChangeImageOnDismiss}
                    onSelected={onOneKindImagePicked}
                  />
                  <View style={{ marginHorizontal: wp('1%', insets) }} />
                  <AppQuaternaryButton
                    box
                    onPress={previewChangeTemplateOnPress}
                    style={styles.previewActionButtonItem}>
                    <AppTextBody4>{t('createNFT:changeTemplate')}</AppTextBody4>
                  </AppQuaternaryButton>
                </View>
              </View>
            ) : (
              <View style={styles.formInput}>
                <AppInfoMessage
                  box
                  icon={iconMap.imageUnavailable}
                  title={t('createNFT:previewUnavailable')}
                  message={t('createNFT:previewUnavailableMessage')}
                />
              </View>
            )}
          </AppAccordion>
        </View>
        <View
          style={{
            height: hp(Platform.OS === 'ios' ? '10%' : '12.5%', insets),
          }}
        />
      </ScrollView>
      <View style={styles.actionContainer}>
        <View style={{ height: hp('2%', insets) }} />
        <AppPrimaryButton
          onPress={formikProps.handleSubmit}
          loading={isLoading}
          disabled={!(formikProps.isValid && formikProps.dirty)}
          style={styles.actionButton}>
          {t('createNFT:createButton')}
        </AppPrimaryButton>
      </View>
      <AppMenuContainer
        memoKey={['visible']}
        tapEverywhereToDismiss
        enablePanDownToClose
        snapPoints={closeMenuSnapPoints}
        visible={closeMenuVisible}
        onDismiss={closeMenuOnDismiss}>
        <AppHeaderWizard
          noHeaderSpace
          mode={'icon'}
          modeData={'question'}
          style={styles.closeMenuContainer}
          title={t('createNFT:saveSession')}
          titleStyle={styles.closeMenuTitle}
          description={t('createNFT:saveSessionDescription')}
        />
        <View style={styles.closeMenuAction}>
          <View style={styles.closeMenuItemAction}>
            <AppSecondaryButton onPress={discardFormState}>
              {t('createNFT:discard')}
            </AppSecondaryButton>
          </View>
          <View style={styles.closeMenuActionSpace} />
          <View style={styles.closeMenuItemAction}>
            <AppPrimaryButton onPress={saveFormState}>
              {t('createNFT:save')}
            </AppPrimaryButton>
          </View>
        </View>
      </AppMenuContainer>
    </AppView>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    scrollContainer: {
      zIndex: -9,
    },
    accordionListView: {
      flexDirection: 'row',
      marginLeft: wp('1%', insets),
    },
    accordionIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    actionContainer: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      width: '100%',
      bottom: 0,
    },
    actionButton: {
      marginBottom: Platform.OS === 'ios' ? insets.bottom : hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
      marginBottom: hp('3%', insets),
    },
    formView: {
      flex: 0,
    },
    formInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    previewAction: {
      flexDirection: 'row',
      marginTop: hp('1%', insets),
    },
    previewActionButton: {
      flex: 1,
      height: hp('5.2%', insets),
    },
    previewActionButtonItem: {
      flex: 1,
      height: hp('5.2%', insets),
      width: '100%',
    },
    closeMenuContainer: {
      width: wp('90%', insets),
      alignSelf: 'center',
      flex: 0,
    },
    closeMenuTitle: {
      marginTop: hp('1%', insets),
    },
    closeMenuAction: {
      paddingHorizontal: wp('5%', insets),
      marginTop: hp('3%', insets),
      flexDirection: 'row',
    },
    closeMenuItemAction: {
      flex: 1,
    },
    closeMenuActionSpace: {
      marginHorizontal: wp('1%', insets),
    },
  });
