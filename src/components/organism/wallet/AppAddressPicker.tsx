import { View, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import React from 'react';
import AppListPickerItem from 'enevti-app/components/molecules/listpicker/AppListPickerItem';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';
import { Divider, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { wp, hp } from 'enevti-app/utils/layout/imageRatio';
import AppFormTextInputWithError from 'enevti-app/components/molecules/form/AppFormTextInputWithError';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import {
  addressToBase32,
  base32ToAddress,
  getBasePersona,
  getBasePersonaByUsername,
  isValidAddress,
  isValidBase32,
  parsePersonaLabel,
} from 'enevti-app/service/enevti/persona';
import { Persona } from 'enevti-types/account/persona';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppAddressPickerProps {
  value?: Persona;
  loading?: boolean;
  onSelected?: (persona: Persona) => void;
}

export default function AppAddressPicker({ value, onSelected, loading = false }: AppAddressPickerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme as Theme), [theme]);
  const snapPoints = React.useMemo(() => ['105%'], []);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [persona, setPersona] = React.useState<Persona | undefined>(() => value);
  const [error, setError] = React.useState<string>('');
  const [loadingPersona, setLoadingPersona] = React.useState<boolean>(false);

  const [text, setText] = React.useState<string>('');
  const [debouncedText] = useDebounce(text, 1000);

  React.useEffect(() => {
    const run = async () => {
      if (debouncedText) {
        setLoadingPersona(true);
        try {
          if (
            debouncedText.substring(0, COIN_NAME.length) === COIN_NAME.toLowerCase() &&
            isValidBase32(debouncedText)
          ) {
            const base32Response = await getBasePersona(base32ToAddress(debouncedText));
            if (base32Response.status === 200) {
              setPersona(base32Response.data);
            } else {
              setPersona({
                address: base32ToAddress(debouncedText),
                base32: debouncedText,
                photo: '',
                username: '',
              });
            }
            setError('');
          } else if (debouncedText.substring(0, 1) === '@') {
            const usernameResponse = await getBasePersonaByUsername(debouncedText.substring(1));
            if (usernameResponse.status === 200) {
              setPersona(usernameResponse.data);
              setError('');
            } else {
              setError(t('wallet:usernameNotFound'));
            }
          } else if (isValidAddress(debouncedText)) {
            const addressResponse = await getBasePersona(debouncedText);
            if (addressResponse.status === 200) {
              setPersona(addressResponse.data);
            } else {
              setPersona({
                address: debouncedText,
                base32: addressToBase32(debouncedText),
                photo: '',
                username: '',
              });
            }
            setError('');
          } else {
            setError(t('wallet:invalidRecipient'));
          }
        } catch {
          setError(t('wallet:invalidRecipient'));
        } finally {
          setLoadingPersona(false);
        }
      } else {
        setError('');
        setPersona(undefined);
      }
    };
    run();
  }, [debouncedText, t]);

  const onClear = React.useCallback(() => {
    setText('');
    setPersona(undefined);
    setError('');
  }, []);

  const onShow = React.useCallback(() => {
    setVisible(old => !old);
    setLoadingPersona(false);
    onClear();
  }, [onClear]);

  const onDismiss = React.useCallback(() => {
    setVisible(false);
    setText('');
    setError('');
  }, []);

  const onRecipientChanged = React.useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setText(e.nativeEvent.text);
  }, []);

  const onPersonaPicked = React.useCallback(() => {
    persona && onSelected && onSelected(persona);
    onDismiss();
  }, [onSelected, onDismiss, persona]);

  const recipientInputRight = React.useMemo(
    () =>
      text ? (
        <TextInput.Icon
          name={iconMap.close}
          onPress={onClear}
          color={theme.colors.placeholder}
          forceTextInputFocus={false}
        />
      ) : undefined,
    [onClear, text, theme.colors.placeholder],
  );

  return (
    <View>
      <AppListPickerItem
        loading={loading}
        showDropDown
        onPress={onShow}
        icon={iconMap.add}
        title={value ? (value.username ? value.username : undefined) : t('wallet:specifyRecipient')}
        description={
          value && value.base32 ? value.base32 : t('wallet:specifyRecipientDescription', { coin: COIN_NAME })
        }
        left={value ? <AppAvatarRenderer persona={value} size={30} style={styles.listIcon} /> : undefined}
        style={styles.pickerItem}
      />
      <AppMenuContainer enablePanDownToClose={false} snapPoints={snapPoints} visible={visible} onDismiss={onDismiss}>
        <SafeAreaView>
          <View style={styles.headerInput}>
            <AppIconButton icon={iconMap.arrowBack} onPress={onDismiss} style={styles.backIcon} />
            <AppFormTextInputWithError
              dense
              right={recipientInputRight}
              theme={theme}
              value={text}
              label={t('wallet:recipient')}
              placeholder={t('wallet:recipientDescription')}
              style={styles.formInput}
              onChange={onRecipientChanged}
              onSubmitEditing={() => {}}
              blurOnSubmit={true}
              autoComplete={'off'}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType="go"
            />
          </View>

          <Divider style={styles.divider} />

          {!loadingPersona ? (
            error ? (
              <View>
                <AppTextBody3 style={styles.errorText}>{error}</AppTextBody3>
              </View>
            ) : debouncedText && persona ? (
              <AppListItem
                onPress={onPersonaPicked}
                containerStyle={styles.accountCard}
                leftContent={
                  <View style={styles.collectionCoverContainer}>
                    <AppAvatarRenderer persona={persona} size={wp('12%')} style={styles.avatar} />
                  </View>
                }>
                <AppTextHeading3 numberOfLines={1}>{parsePersonaLabel(persona)}</AppTextHeading3>
                {persona.username ? (
                  <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
                    {persona.base32}
                  </AppTextBody4>
                ) : null}
              </AppListItem>
            ) : (
              <View>
                <AppTextBody3 style={styles.infoText}>{t('wallet:startSearchRecipient')}</AppTextBody3>
              </View>
            )
          ) : (
            <View style={styles.loaderContainer}>
              <AppActivityIndicator animating />
            </View>
          )}
        </SafeAreaView>
      </AppMenuContainer>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    listIcon: {
      marginRight: wp('3%'),
      alignSelf: 'center',
    },
    pickerItem: {
      backgroundColor: theme.dark
        ? Color(theme.colors.background).lighten(0.5).rgb().string()
        : Color(theme.colors.background).darken(0.04).rgb().string(),
    },
    divider: {
      marginBottom: hp('3%'),
    },
    errorText: {
      textAlign: 'center',
      color: theme.colors.error,
    },
    infoText: { textAlign: 'center', color: theme.colors.placeholder },
    formInput: {
      flex: 1,
    },
    headerInput: {
      marginHorizontal: wp('3%'),
      marginBottom: hp('3%'),
      flexDirection: 'row',
      alignItems: 'center',
    },
    backIcon: {
      marginRight: wp('3%'),
    },
    accountCard: {
      marginHorizontal: wp('3%'),
    },
    collectionCoverContainer: {
      marginRight: wp('3%'),
      overflow: 'hidden',
      alignSelf: 'center',
    },
    avatar: {
      alignSelf: 'center',
    },
    loaderContainer: {
      justifyContent: 'center',
    },
  });
