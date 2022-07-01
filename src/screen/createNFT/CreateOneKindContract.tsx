import React from 'react';
import { StyleSheet, View, Keyboard, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput as PaperInput, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import DocumentPicker from 'react-native-document-picker';
import { FormikProps, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCreateNFTOneKindQueue,
  createNFTOneKindQueueInitialState,
  selectCreateNFTOneKindQueue,
  setCreateNFTOneKindData,
  setCreateNFTOneKindState,
  setCreateNFTOneKindStateItem,
  setCreateNFTOneKindStatus,
} from 'enevti-app/store/slices/queue/nft/create/onekind';
import * as Yup from 'yup';

import { Theme } from 'enevti-app/theme/default';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import AppFormTextInputWithError, {
  AppFormTextInputWithErrorProps,
} from 'enevti-app/components/molecules/AppFormTextInputWithError';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { ScrollView } from 'react-native-gesture-handler';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import { OneKindContractForm } from 'enevti-app/types/ui/screen/CreateOneKindContract';
import AppCoinChipsPicker from 'enevti-app/components/organism/AppCoinChipsPicker';
import { cleanTMPImage, isNameAvailable, isSymbolAvailable } from 'enevti-app/service/enevti/nft';
import AppUtilityPicker from 'enevti-app/components/organism/picker/AppUtilityPicker';
import AppRecurringPicker from 'enevti-app/components/organism/picker/AppRecurringPicker.tsx';
import AppDateMonthPicker from 'enevti-app/components/organism/datePicker/AppDateMonthPicker';
import AppDayPicker from 'enevti-app/components/organism/datePicker/AppDayPicker';
import AppDatePicker from 'enevti-app/components/organism/datePicker/AppDatePicker';
import AppDateMonthYearPicker from 'enevti-app/components/organism/datePicker/AppDateMonthYearPicker';
import AppHourMinutePicker from 'enevti-app/components/organism/datePicker/AppHourMinutePicker';
import AppRedeemLimitPicker from 'enevti-app/components/organism/picker/AppRedeemLimitPicker';
import AppContentPicker from 'enevti-app/components/organism/picker/AppContentPicker';
import AppMintingPeriodPicker from 'enevti-app/components/organism/picker/AppMintingPeriodPicker';
import AppAccordion from 'enevti-app/components/atoms/accordion/AppAccordion';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { makeDummyNFT } from 'enevti-app/utils/dummy/nft';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import AppInfoMessage from 'enevti-app/components/molecules/message/base/AppInfoMessage';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import AppCameraGalleryPicker from 'enevti-app/components/organism/picker/AppCameraGalleryPicker';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { clearCreateNFTQueueType } from 'enevti-app/store/slices/queue/nft/create/type';
import { clearCreateNFTQueueRoute } from 'enevti-app/store/slices/queue/nft/create/route';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { hideModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { payCreateNFTOneKind } from 'enevti-app/store/middleware/thunk/payment/creator/payCreateNFTOneKind';
import getFileExtension from 'enevti-app/utils/mime/getFileExtension';
import timezoneOffsetLabel from 'enevti-app/utils/date/timezoneOffsetLabel';
import AppConfirmationModal from 'enevti-app/components/organism/menu/AppConfirmationModal';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import AppTextHeading5 from 'enevti-app/components/atoms/text/AppTextHeading5';
import AppMintingTypePicker from 'enevti-app/components/organism/picker/AppMintingTypePicker';

type Props = StackScreenProps<RootStackParamList, 'CreateOneKindContract'>;

const setMultipleFieldValue = (
  reducer: (key: keyof OneKindContractForm, value: any, shouldValidate?: boolean) => void,
  formik: FormikProps<OneKindContractForm & { initialDirty: string }>,
  keys: (keyof OneKindContractForm)[],
  initial: boolean = false,
  shouldValidate: boolean = false,
  value?: string | number,
) => {
  for (let i = 0; i < keys.length; i++) {
    if (initial) {
      reducer(keys[i], createNFTOneKindQueueInitialState.state[keys[i]], shouldValidate);
    } else {
      reducer(keys[i], value, shouldValidate);
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
  reducer: (key: keyof OneKindContractForm, value: any, shouldValidate?: boolean) => void,
  formik: FormikProps<OneKindContractForm & { initialDirty: string }>,
) => {
  setMultipleFieldValue(reducer, formik, redeemTimeKey, true);
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
  'contentExtension',
  'contentUri',
];

const coverKey: (keyof OneKindContractForm)[] = ['coverName', 'coverSize', 'coverType', 'coverExtension', 'coverUri'];

export default function CreateOneKindContract({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const oneKindContractStore = useSelector(selectCreateNFTOneKindQueue);
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const timezoneOffset = React.useMemo(() => new Date().getTimezoneOffset(), []);
  const itemWidth = React.useMemo(() => wp('90%', insets), [insets]);
  const paymentThunkRef = React.useRef<any>();

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
  const [oneKindSheetVisible, setOneKindSheetVisible] = React.useState<boolean>(false);
  const [closeMenuVisible, setCloseMenuVisible] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
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
          .matches(/^[A-Z0-9]+$/, t('form:upercase'))
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
          is: (val: string) => val === 'weekly',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        timeDate: Yup.number().when('recurring', {
          is: (val: string) => val === 'monthly' || val === 'once',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        timeMonth: Yup.number().when('recurring', {
          is: (val: string) => val === 'yearly' || val === 'once',
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
        fromMinute: Yup.number().when('utility', {
          is: (val: string) => val !== 'content',
          then: Yup.number().min(0, t('form:greaterEqualZero')),
        }),
        untilHour: Yup.number().when('utility', {
          is: (val: string) => val !== 'content',
          then: Yup.number().min(-1, t('form:positiveNumber')),
        }),
        untilMinute: Yup.number().when('utility', {
          is: (val: string) => val !== 'content',
          then: Yup.number().min(-1, t('form:positiveNumber')),
        }),
        redeemLimitOption: Yup.string().when('recurring', {
          is: (val: string) => val === 'once' || val === 'anytime',
          otherwise: Yup.string().required(),
        }),
        redeemLimit: Yup.number().when('redeemLimitOption', {
          is: 'fixed',
          then: Yup.number()
            .transform(value => (isNaN(value) ? undefined : value))
            .min(0, t('form:greaterEqualZero')),
        }),
        royaltyCreator: Yup.number()
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
    paymentThunkRef.current = dispatch(payCreateNFTOneKind(payload));
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

  const paymentIdleCallback = React.useCallback(() => {
    setIsLoading(false);
    paymentThunkRef.current?.abort();
  }, []);

  const paymentSuccessCallback = React.useCallback(() => {
    dispatch(hideModalLoader());
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
    discardFormState();
  }, [dispatch, discardFormState, t]);

  const paymentErrorCallback = React.useCallback(() => dispatch(hideModalLoader()), [dispatch]);

  usePaymentCallback({
    onIdle: paymentIdleCallback,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

  const nextRefCallback = React.useCallback(nextref => () => nextref && nextref.current?.focus(), []);

  const setFormStateValue = React.useCallback(
    (key: keyof OneKindContractForm, value: any, shouldValidate?: boolean) => {
      formikProps.setFieldValue(key, value, shouldValidate);
      dispatch(setCreateNFTOneKindStateItem({ key, value }));
    },
    [formikProps, dispatch],
  );

  const commonOnEndEditing = React.useCallback(
    key => (e: any) => setFormStateValue(key, e.nativeEvent.text, true),
    [setFormStateValue],
  );

  const commonOnBlur = React.useCallback((key, formik) => () => formik.setFieldTouched(key), []);

  const onDeleteCoverPicker = React.useCallback(() => {
    setMultipleFieldValue(setFormStateValue, formikProps, coverKey, true);
    setMultipleFieldTouched(formikProps, coverKey, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedCoverPicker = React.useCallback(item => {
    setFormStateValue('coverName', item.name, false);
    setFormStateValue('coverSize', item.size, false);
    setFormStateValue('coverType', item.type, false);
    setFormStateValue('coverExtension', getFileExtension(item.name), false);
    setFormStateValue('coverUri', item.uri, false);
    setMultipleFieldTouched(formikProps, coverKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBlurPriceInput = React.useCallback(() => {
    !formikProps.touched.priceAmount && formikProps.setFieldTouched('priceAmount');
  }, [formikProps]);

  const onSelectedMintingPeriodPicker = React.useCallback(item => {
    if (item.value === 'no-limit') {
      setFormStateValue('mintingExpire', '0', true);
    } else {
      setFormStateValue('mintingExpire', '1', true);
    }
    setFormStateValue('mintingExpireOption', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedMintingTypePicker = React.useCallback(item => {
    setFormStateValue('mintingType', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedUtilityPicker = React.useCallback(item => {
    if (item.value === 'content') {
      setFormStateValue('recurring', 'anytime', true);
      resetRedeemTimeKeyFields(setFormStateValue, formikProps);
    } else {
      setMultipleFieldValue(setFormStateValue, formikProps, contentKey, true, true);
      setMultipleFieldTouched(formikProps, contentKey, false);
    }
    formikProps.setFieldValue('initialDirty', 'undirty', true);
    setFormStateValue('utility', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteContentPicker = React.useCallback(() => {
    setMultipleFieldValue(setFormStateValue, formikProps, contentKey, true, true);
    setMultipleFieldTouched(formikProps, contentKey, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedContentPicker = React.useCallback(item => {
    setFormStateValue('contentName', item.name, false);
    setFormStateValue('contentSize', item.size, false);
    setFormStateValue('contentType', item.type, false);
    setFormStateValue('contentExtension', getFileExtension(item.name), false);
    setFormStateValue('contentUri', item.uri, true);
    setMultipleFieldTouched(formikProps, contentKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedRecurringPicker = React.useCallback(item => {
    resetRedeemTimeKeyFields(setFormStateValue, formikProps);
    if (item.value === 'daily') {
      setMultipleFieldTouched(formikProps, ['timeDay', 'timeDate'], true);
    }
    formikProps.setFieldValue('initialDirty', 'undirty', true);
    setFormStateValue('recurring', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDayPicker = React.useCallback(value => {
    setFormStateValue('timeDay', value[0], true);
    formikProps.setFieldTouched('timeDay', true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDatePicker = React.useCallback(value => {
    setFormStateValue('timeDate', value[0], true);
    formikProps.setFieldTouched('timeDate', true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDateMonthPicker = React.useCallback(value => {
    setFormStateValue('timeMonth', value[0], true);
    setFormStateValue('timeDate', value[1], true);
    setMultipleFieldTouched(formikProps, ['timeMonth', 'timeDate'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDateMonthYearPicker = React.useCallback(value => {
    setFormStateValue('timeYear', value[0], true);
    setFormStateValue('timeMonth', value[1], true);
    setFormStateValue('timeDate', value[2], true);
    setMultipleFieldTouched(formikProps, ['timeYear', 'timeMonth', 'timeDate'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedHourMinutePickerStart = React.useCallback(value => {
    setFormStateValue('fromHour', value[0], true);
    setFormStateValue('fromMinute', value[1], true);
    setMultipleFieldTouched(formikProps, ['fromHour', 'fromMinute'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedHourMinutePickerEnd = React.useCallback(value => {
    setFormStateValue('untilHour', value[0], true);
    setFormStateValue('untilMinute', value[1], true);
    setMultipleFieldTouched(formikProps, ['untilHour', 'untilMinute'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedRedeemLimitPicker = React.useCallback(item => {
    if (item.value === 'no-limit') {
      setFormStateValue('redeemLimit', 0, true);
    }
    setFormStateValue('redeemLimitOption', item.value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOneKindImagePicked = React.useCallback(
    (image: ImageOrVideo) => {
      dispatch(
        setCreateNFTOneKindData({
          uri: image.path,
          mime: image.mime,
          extension: getFileExtension(image.path),
          size: image.size,
        }),
      );
      setOneKindSheetVisible(false);
    },
    [dispatch],
  );

  const labelHourMinutePickerStart = React.useMemo(
    () => t('createNFT:redeemStartTime') + ` (${timezoneOffsetLabel(timezoneOffset)})`,
    [t, timezoneOffset],
  );

  const labelHourMinutePickerEnd = React.useMemo(
    () => t('createNFT:redeemEndTime') + ` (${timezoneOffsetLabel(timezoneOffset)})`,
    [t, timezoneOffset],
  );

  const dateMonthPickerValue = React.useMemo(
    () => [formikProps.values.timeMonth, formikProps.values.timeDate],
    [formikProps.values.timeMonth, formikProps.values.timeDate],
  );

  const dayPickerValue = React.useMemo(() => [formikProps.values.timeDay], [formikProps.values.timeDay]);

  const datePickerValue = React.useMemo(() => [formikProps.values.timeDate], [formikProps.values.timeDate]);

  const dateMonthYearPickerValue = React.useMemo(
    () => [formikProps.values.timeYear, formikProps.values.timeMonth, formikProps.values.timeDate],
    [formikProps.values.timeYear, formikProps.values.timeMonth, formikProps.values.timeDate],
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

  const CoinChips = React.useMemo(() => <AppCoinChipsPicker dense />, []);
  const CoinChipsPlaceholder = React.useMemo(() => <PaperInput.Icon name={iconMap.dropDown} />, []);

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
        onEndEditing={commonOnEndEditing(key)}
        onSubmitEditing={nextRefCallback(nextref)}
        {...options}
      />
    ),
    [paperTheme, styles.formInput, nextRefCallback, commonOnEndEditing, commonOnBlur],
  );

  const accordionHeader = React.useCallback(
    (icon: string, text: string) => (
      <View style={styles.accordionListView}>
        <AppIconComponent name={icon} color={theme.colors.text} size={20} style={styles.accordionIcon} />
        <AppTextBody3>{text}</AppTextBody3>
      </View>
    ),
    [styles.accordionIcon, styles.accordionListView, theme.colors.text],
  );

  const identityHeader = React.useMemo(
    () => accordionHeader(iconMap.identity, t('createNFT:nftIdentity')),
    [accordionHeader, t],
  );

  const identityHeaderCallback = React.useCallback(() => setIdentityExpanded(!identityExpanded), [identityExpanded]);

  const mintingHeader = React.useMemo(
    () => accordionHeader(iconMap.mintingBehaviour, t('createNFT:nftMintingBehaviour')),
    [accordionHeader, t],
  );

  const mintingHeaderCallback = React.useCallback(() => setMintingExpanded(!mintingExpanded), [mintingExpanded]);

  const utilityHeader = React.useMemo(
    () => accordionHeader(iconMap.utility, t('createNFT:nftUtility')),
    [accordionHeader, t],
  );

  const utilityHeaderCallback = React.useCallback(() => setUtilityExpanded(!utilityExpanded), [utilityExpanded]);

  const royaltyHeader = React.useMemo(
    () => accordionHeader(iconMap.royalty, t('createNFT:nftRoyalty')),
    [accordionHeader, t],
  );

  const royaltyHeaderCallback = React.useCallback(() => setRoyaltyExpanded(!royaltyExpanded), [royaltyExpanded]);

  const previewHeader = React.useMemo(
    () => accordionHeader(iconMap.preview, t('createNFT:nftPreview')),
    [accordionHeader, t],
  );

  const previewHeaderCallback = React.useCallback(() => setPreviewExpanded(!previewExpanded), [previewExpanded]);

  const previewChangeImageOnDismiss = React.useCallback(() => setOneKindSheetVisible(false), []);

  const previewChangeImageOnPress = React.useCallback(() => setOneKindSheetVisible(old => !old), []);

  const previewChangeTemplateOnPress = React.useCallback(
    () =>
      navigation.navigate('ChooseNFTTemplate', {
        mode: 'change',
      }),
    [navigation],
  );

  const closeMenuOnDismiss = React.useCallback(() => setCloseMenuVisible(false), []);

  return (
    <AppView
      withModal
      withPayment
      withLoader
      edges={['bottom', 'left', 'right']}
      headerOffset={insets.top}
      header={
        <AppHeader compact back backIcon={iconMap.close} backIconSize={23} navigation={navigation} title={' '} />
      }>
      <ScrollView style={styles.scrollContainer}>
        <AppHeaderWizard
          title={t('createNFT:setupContract')}
          description={t('createNFT:setupContractDescription')}
          style={styles.header}
          memoKey={[]}
        />

        <View style={styles.formView}>
          <AppAccordion expanded={identityExpanded} onPress={identityHeaderCallback} title={identityHeader}>
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
                errorText: !formikProps.status.nameAvailable ? t('createNFT:nameUnavailable') : formikProps.errors.name,
                error: formikProps.touched.name && (!formikProps.status.nameAvailable || !!formikProps.errors.name),
                onEndEditing: async e => {
                  const text = e.nativeEvent.text;
                  setFormStateValue('name', text, true);
                  if (text) {
                    const nameAvailable = await isNameAvailable(text);
                    formikProps.setStatus({
                      ...formikProps.status,
                      nameAvailable,
                    });
                  }
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
                  formikProps.touched.symbol && (!formikProps.status.symbolAvailable || !!formikProps.errors.symbol),
                onEndEditing: async e => {
                  const text = e.nativeEvent.text;
                  setFormStateValue('symbol', text, true);
                  if (text) {
                    const symbolAvailable = await isSymbolAvailable(text);
                    formikProps.setStatus({
                      ...formikProps.status,
                      symbolAvailable,
                    });
                  }
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

          <AppAccordion expanded={mintingExpanded} onPress={mintingHeaderCallback} title={mintingHeader}>
            <View style={{ height: hp('1%', insets) }} />
            <AppMintingTypePicker value={formikProps.values.mintingType} onSelected={onSelectedMintingTypePicker} />
            {commonFormInput(
              formikProps,
              priceInput,
              'priceAmount',
              t('createNFT:collectionPrice'),
              t('createNFT:collectionPricePlaceholder'),
              {
                onBlur: onBlurPriceInput,
                keyboardType: 'number-pad',
                hideMaxLengthIndicator: true,
                maxLength: 13,
                endComponent: CoinChips,
                right: CoinChipsPlaceholder,
                memoKey: ['error', 'showError', 'endComponent'],
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

          <AppAccordion expanded={utilityExpanded} onPress={utilityHeaderCallback} title={utilityHeader}>
            <View style={{ height: hp('1%', insets) }} />
            <AppUtilityPicker value={formikProps.values.utility} onSelected={onSelectedUtilityPicker} />

            {formikProps.values.utility === '' &&
            oneKindContractStore.choosenTemplate.data.main.findIndex(x => x.type.includes('utility')) !== -1 ? (
              <AppListItem
                containerStyle={styles.utilityTemplateNote}
                leftContent={
                  <AppIconGradient
                    name={iconMap.info}
                    size={wp('5%', insets)}
                    androidRenderingMode={'software'}
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.utilityTemplateIcon}
                  />
                }>
                <AppTextBody5 style={styles.utilityTemplateText} numberOfLines={2}>
                  <AppTextHeading5>{t('createNFT:proTip')}</AppTextHeading5> {t('createNFT:proTipDescription')}
                </AppTextBody5>
              </AppListItem>
            ) : null}

            <View style={{ height: hp('1%', insets) }} />

            {formikProps.values.utility && formikProps.values.utility === 'content' ? (
              <AppContentPicker
                title={t('createNFT:selectContent')}
                description={t('createNFT:selectContentDescription')}
                value={contentPickerValue}
                onDelete={onDeleteContentPicker}
                onSelected={onSelectedContentPicker}
              />
            ) : null}

            {formikProps.values.utility && formikProps.values.utility !== 'content' ? (
              <>
                <AppRecurringPicker value={formikProps.values.recurring} onSelected={onSelectedRecurringPicker} />
                <View style={{ height: hp('1%', insets) }} />
              </>
            ) : null}

            {formikProps.values.recurring === 'weekly' ? (
              <AppDayPicker label={t('createNFT:redeemDay')} onSelected={onSelectedDayPicker} value={dayPickerValue} />
            ) : formikProps.values.recurring === 'monthly' ? (
              <AppDatePicker
                label={t('createNFT:redeemDate')}
                onSelected={onSelectedDatePicker}
                value={datePickerValue}
              />
            ) : formikProps.values.recurring === 'yearly' ? (
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
            (formikProps.touched.timeDay ||
              formikProps.touched.timeDate ||
              formikProps.values.initialDirty === 'dirty') ? (
              <AppHourMinutePicker
                label={labelHourMinutePickerStart}
                onSelected={onSelectedHourMinutePickerStart}
                value={hourMinuteStartValue}
              />
            ) : null}

            {formikProps.values.recurring !== 'anytime' &&
            ((formikProps.touched.fromHour && formikProps.touched.fromMinute) ||
              formikProps.values.initialDirty === 'dirty') ? (
              <AppHourMinutePicker
                label={labelHourMinutePickerEnd}
                onSelected={onSelectedHourMinutePickerEnd}
                value={hourMinuteEndValue}
              />
            ) : null}

            {((formikProps.touched.untilHour && formikProps.touched.untilMinute) ||
              formikProps.values.initialDirty === 'dirty') &&
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

          <AppAccordion expanded={royaltyExpanded} onPress={royaltyHeaderCallback} title={royaltyHeader}>
            <View style={{ height: hp('1%', insets) }} />
            {commonFormInput(
              formikProps,
              creatorRoyaltyInput,
              'royaltyCreator',
              t('createNFT:collectionRoyaltyCreator'),
              t('createNFT:collectionRoyaltyCreatorDescription'),
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

          <AppAccordion expanded={previewExpanded} onPress={previewHeaderCallback} title={previewHeader}>
            <View style={{ height: hp('1%', insets) }} />
            {formikProps.values.name && formikProps.values.symbol && formikProps.values.utility ? (
              <View style={styles.formInput}>
                <AppNFTRenderer nft={dummyNFT} width={itemWidth} dataUri={oneKindContractStore.data.uri} />
                <View style={styles.previewAction}>
                  <AppQuaternaryButton box onPress={previewChangeImageOnPress} style={styles.previewActionButtonItem}>
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
          onPress={formikProps.submitForm}
          loading={isLoading}
          disabled={
            !(
              formikProps.isValid &&
              formikProps.dirty &&
              Object.values(formikProps.status).every(value => value === true)
            )
          }
          style={styles.actionButton}>
          {t('createNFT:createButton')}
        </AppPrimaryButton>
      </View>
      <AppConfirmationModal
        iconName={'question'}
        visible={closeMenuVisible}
        onDismiss={closeMenuOnDismiss}
        title={t('createNFT:saveSession')}
        description={t('createNFT:saveSessionDescription')}
        cancelText={t('createNFT:discard')}
        cancelOnPress={discardFormState}
        okText={t('createNFT:save')}
        okOnPress={saveFormState}
      />
    </AppView>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    utilityTemplateNote: {
      marginVertical: hp('2%', insets),
    },
    utilityTemplateIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    utilityTemplateText: {
      color: theme.colors.placeholder,
    },
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
