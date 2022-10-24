import { Keyboard, NativeSyntheticEvent, Share, StyleSheet, TextInputChangeEventData, View } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppQRCode from 'enevti-app/components/atoms/qr/AppQRCode';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTertiaryButton from 'enevti-app/components/atoms/button/AppTertiaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { COIN_NAME, getCoinName } from 'enevti-app/utils/constant/identifier';
import AppFormTextInputWithError from 'enevti-app/components/molecules/AppFormTextInputWithError';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import Clipboard from '@react-native-clipboard/clipboard';
import { handleError } from 'enevti-app/utils/error/handle';
import { isNumeric } from 'enevti-app/utils/primitive/string';
import { getAppLink } from 'enevti-app/utils/linking';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';

type Props = StackScreenProps<RootStackParamList, 'ReceiveToken'>;

export default function ReceiveToken({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const myPersona = useSelector(selectMyPersonaCache);

  const [qrValue, setQrValue] = React.useState<string>(() =>
    getAppLink('send', new URLSearchParams({ base32: myPersona.base32 }).toString()),
  );
  const [requestAmountError, setRequestAmountError] = React.useState<string>('');
  const [requestAmountTouched, setRequestAmountTouched] = React.useState<boolean>(false);

  const onEnvtAddressCopy = React.useCallback(() => {
    Keyboard.dismiss();
    Clipboard.setString(myPersona.base32);
    dispatch(showSnackbar({ mode: 'info', text: t('wallet:envtCopied', { coin: COIN_NAME }) }));
  }, [dispatch, myPersona.base32, t]);

  const onQrCopy = React.useCallback(() => {
    Keyboard.dismiss();
    Clipboard.setString(qrValue);
    dispatch(showSnackbar({ mode: 'info', text: t('wallet:qrCopied') }));
  }, [dispatch, qrValue, t]);

  const onShare = React.useCallback(async () => {
    try {
      Keyboard.dismiss();
      await Share.share({ message: qrValue });
    } catch (err) {
      handleError(err);
    }
  }, [qrValue]);

  const onRequestAmountChanged = React.useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      if (e.nativeEvent.text === '') {
        const qr = getAppLink('send', new URLSearchParams({ base32: myPersona.base32 }).toString());
        setQrValue(qr);
        if (requestAmountError) {
          setRequestAmountError('');
        }
      } else if (isNumeric(e.nativeEvent.text)) {
        if (parseFloat(e.nativeEvent.text) < 0) {
          setRequestAmountError(t('wallet:amountMustBePositive'));
        } else {
          const qr = getAppLink(
            'send',
            new URLSearchParams({ base32: myPersona.base32, amount: completeTokenUnit(e.nativeEvent.text) }).toString(),
          );
          setQrValue(qr);
          if (requestAmountError) {
            setRequestAmountError('');
          }
        }
      } else {
        setRequestAmountError(t('wallet:invalidAmount'));
      }
    },
    [myPersona.base32, requestAmountError, t],
  );

  const onRequestAmountBlur = React.useCallback(_ => {
    setRequestAmountTouched(true);
  }, []);

  return (
    <AppView dismissKeyboard>
      <AppHeaderWizard
        back
        backIcon={iconMap.close}
        navigation={navigation}
        title={t('wallet:receiveCoin', { coin: getCoinName() })}
        description={t('wallet:receiveTokenDescription')}
        style={styles.header}
      />

      <AppListItem
        containerStyle={styles.accountCard}
        leftContent={
          <View style={styles.collectionCoverContainer}>
            <AppAvatarRenderer persona={myPersona} size={wp('12%', insets)} style={styles.avatar} />
          </View>
        }
        rightContent={
          <AppIconButton size={20} icon={iconMap.copy} onPress={onEnvtAddressCopy} style={styles.avatar} />
        }>
        <AppTextHeading3 numberOfLines={1}>{parsePersonaLabel(myPersona)}</AppTextHeading3>
        {myPersona.username ? (
          <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
            {myPersona.base32}
          </AppTextBody4>
        ) : null}
      </AppListItem>

      <View style={styles.qrContainer}>
        <View style={{ height: hp(27.5) }}>
          <AppQRCode value={qrValue} size={hp(25)} />
        </View>
        <View style={{ height: hp(3) }} />
        <AppQuaternaryButton
          icon={iconMap.copy}
          iconSize={hp('3%', insets)}
          iconColor={theme.colors.placeholder}
          style={{
            height: hp('4%', insets),
          }}
          onPress={onQrCopy}>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>{t('wallet:copyQrValue')}</AppTextBody4>
        </AppQuaternaryButton>
        <View style={styles.formInputContainer}>
          <AppFormTextInputWithError
            theme={paperTheme}
            style={styles.formInput}
            returnKeyType={'go'}
            keyboardType={'number-pad'}
            autoComplete={'off'}
            autoCorrect={false}
            label={t('wallet:requestAmount')}
            placeholder={t('wallet:requestAmountPlaceholder', { currency: getCoinName() })}
            onChange={onRequestAmountChanged}
            error={!!requestAmountError && requestAmountTouched}
            errorText={requestAmountError}
            showError={requestAmountTouched}
            blurOnSubmit={true}
            onBlur={onRequestAmountBlur}
          />
        </View>
      </View>

      <View style={styles.shareButton}>
        <AppTertiaryButton onPress={onShare}>{t('wallet:share')}</AppTertiaryButton>
      </View>
    </AppView>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    avatar: {
      alignSelf: 'center',
    },
    formInputContainer: {
      marginTop: hp(3),
      width: '100%',
    },
    formInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    accountCard: {
      marginVertical: hp('3%', insets),
      marginHorizontal: wp('10%', insets),
    },
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
    },
    qrContainer: {
      flex: 1,
      alignItems: 'center',
    },
    shareButton: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    collectionCoverContainer: {
      marginRight: wp('3%', insets),
      overflow: 'hidden',
      alignSelf: 'center',
    },
  });
