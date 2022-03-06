import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { List, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

import { encryptWithPassword } from '../../utils/cryptography';
import { Theme } from '../../theme/default';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../../navigation';
import AppFormTextInputWithError from '../../components/molecules/AppFormTextInputWithError';
import AppPrimaryButton from '../../components/atoms/button/AppPrimaryButton';
import AppView from '../../components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';
import YupBIP39 from '../../utils/yupbip39';
import { useDispatch } from 'react-redux';
import { setEncryptedPassphraseAuth } from '../../store/slices/auth';
import { setLocalSessionKey } from '../../store/slices/session/local';
import { iconMap } from '../../components/atoms/icon/AppIconComponent';
import { ScrollView } from 'react-native-gesture-handler';
import AppQuaternaryButton from '../../components/atoms/button/AppQuaternaryButton';
import AppTextBody3 from '../../components/atoms/text/AppTextBody3';
import AppTextHeading3 from '../../components/atoms/text/AppTextHeading3';
import AppMenuContainer from '../../components/atoms/menu/AppMenuContainer';
import AppListItem from '../../components/molecules/list/AppListItem';
import AppTextBody4 from '../../components/atoms/text/AppTextBody4';
import AppIconGradient from '../../components/molecules/AppIconGradient';
import { OneKindContractForm } from '../../types/screen/CreateOneKindContract';

type Props = StackScreenProps<RootStackParamList, 'CreateOneKindContract'>;
YupPassword(Yup);
YupBIP39(Yup);

const validationSchema = Yup.object().shape({});

const formInitialValues: OneKindContractForm = {
  name: '',
  description: '',
  symbol: '',
  utility: '',
  recurring: '',
  timeDay: 0,
  timeDate: 0,
  timeMonth: 0,
  timeYear: 0,
  fromHour: 0,
  fromMinute: 0,
  until: 0,
  redeemLimit: 0,
  royaltyOrigin: 0,
  royaltyStaker: 0,
  priceAmount: '',
  priceCurrency: '',
  quantity: 0,
  mintingExpire: 0,
};

export default function CreateOneKindContract({ navigation }: Props) {
  const dispatch = useDispatch();
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  const { t } = useTranslation();
  const passwordInput = React.useRef<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [utilitySelectorVisible, setUtilitySelectorVisible] =
    React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const encryptedPassphrase = await encryptWithPassword(
      values.passphrase,
      values.password,
    );
    dispatch(setEncryptedPassphraseAuth(encryptedPassphrase));
    dispatch(setLocalSessionKey(values.password));
    setIsLoading(false);
    navigation.replace('AccountCreated');
  };

  const accordionHeader = React.useCallback(
    (icon: string, text: string) => (
      <View style={styles.accordionListView}>
        <AppIconGradient
          name={icon}
          colors={[theme.colors.primary, theme.colors.secondary]}
          size={20}
          style={styles.accordionIcon}
        />
        <AppTextBody3>{text}</AppTextBody3>
      </View>
    ),
    [
      styles.accordionIcon,
      styles.accordionListView,
      theme.colors.primary,
      theme.colors.secondary,
    ],
  );

  const commonFormInput = React.useCallback(
    (
      formikProps: FormikProps<OneKindContractForm>,
      key: keyof OneKindContractForm,
      label: string,
      placeholder: string,
      options?: Object,
      nextref?: React.MutableRefObject<any>,
    ) => (
      <AppFormTextInputWithError
        theme={paperTheme}
        dense={true}
        style={styles.passwordInput}
        returnKeyType={'go'}
        label={label}
        placeholder={placeholder}
        value={formikProps.values[key].toString()}
        onBlur={() => formikProps.setFieldTouched(key)}
        errorText={
          formikProps.errors[key]
            ? formikProps.values[key].toString().length > 0
              ? t('auth:invalidPassphrase')
              : t('form:required')
            : ''
        }
        error={formikProps.touched[key]}
        showError={formikProps.touched[key]}
        onChangeText={formikProps.handleChange(key)}
        onSubmitEditing={() => nextref && nextref.current.focus()}
        {...options}
      />
    ),
    [paperTheme, styles.passwordInput, t],
  );

  return (
    <AppView withModal>
      <ScrollView>
        <AppHeaderWizard
          back
          backIcon={iconMap.close}
          navigation={navigation}
          title={t('createNFT:setupContract')}
          description={t('createNFT:setupContractDescription')}
          style={styles.header}
        />

        <Formik
          initialValues={formInitialValues}
          onSubmit={async values => {
            Keyboard.dismiss();
            setIsLoading(true);
            await handleFormSubmit(values);
          }}
          validationSchema={validationSchema}>
          {formikProps => (
            <>
              <View style={styles.passwordView}>
                <List.Section>
                  <List.Accordion
                    title={accordionHeader(
                      iconMap.utilityContent,
                      'NFT Identity',
                    )}>
                    {commonFormInput(
                      formikProps,
                      'name',
                      'Collection Name',
                      'Name of your collection',
                    )}
                    <AppFormTextInputWithError
                      label={'Description'}
                      theme={paperTheme}
                      dense={true}
                      multiline={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.description}
                      onBlur={() => formikProps.setFieldTouched('description')}
                      errorText={
                        formikProps.errors.description
                          ? formikProps.values.description.length > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.description}
                      onChangeText={formikProps.handleChange('description')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Symbol (ex: CLTN)'}
                      theme={paperTheme}
                      dense={true}
                      multiline={true}
                      autoCapitalize={'characters'}
                      style={styles.passwordInput}
                      value={formikProps.values.symbol}
                      onBlur={() => formikProps.setFieldTouched('symbol')}
                      errorText={
                        formikProps.errors.symbol
                          ? formikProps.values.symbol.length > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.symbol}
                      onChangeText={formikProps.handleChange('symbol')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                  </List.Accordion>

                  <List.Accordion
                    title={'Minting Behaviour'}
                    titleStyle={{
                      fontSize: wp('4.0%', insets),
                      marginLeft: wp('1%', insets),
                    }}>
                    <AppFormTextInputWithError
                      label={'Price'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.priceAmount}
                      onBlur={() => formikProps.setFieldTouched('priceAmount')}
                      errorText={
                        formikProps.errors.priceAmount
                          ? formikProps.values.priceAmount.length > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.priceAmount}
                      onChangeText={formikProps.handleChange('priceAmount')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Quantity'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.quantity.toString()}
                      onBlur={() => formikProps.setFieldTouched('quantity')}
                      errorText={
                        formikProps.errors.quantity
                          ? formikProps.values.quantity > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.quantity}
                      onChangeText={formikProps.handleChange('quantity')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Minting Period Limit'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.mintingExpire.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('mintingExpire')
                      }
                      errorText={
                        formikProps.errors.mintingExpire
                          ? formikProps.values.mintingExpire > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.mintingExpire}
                      onChangeText={formikProps.handleChange('mintingExpire')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                  </List.Accordion>

                  <List.Accordion
                    title={'Utility'}
                    titleStyle={{
                      fontSize: wp('4.0%', insets),
                      marginLeft: wp('1%', insets),
                    }}>
                    <AppQuaternaryButton
                      box
                      contentContainerStyle={{
                        alignItems: 'center',
                      }}
                      style={{
                        alignItems: 'flex-start',
                        width: wp('90%', insets),
                        height: hp('5.5%', insets),
                        alignSelf: 'center',
                      }}
                      onPress={() => setUtilitySelectorVisible(true)}>
                      <View>
                        <AppTextBody3>Select Utility</AppTextBody3>
                      </View>
                    </AppQuaternaryButton>
                    <View style={{ height: hp('1%', insets) }} />
                    <AppFormTextInputWithError
                      label={'Recurring'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Redeem Date'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyStaker.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyStaker')
                      }
                      errorText={
                        formikProps.errors.royaltyStaker
                          ? formikProps.values.royaltyStaker > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyStaker}
                      onChangeText={formikProps.handleChange('royaltyStaker')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Redeem Start Time'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Redeem End Time'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Redeem Limit'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                  </List.Accordion>

                  <List.Accordion
                    title={'Royalty'}
                    titleStyle={{
                      fontSize: wp('4.0%', insets),
                      marginLeft: wp('1%', insets),
                    }}>
                    <AppFormTextInputWithError
                      label={'Creator Royalty (%)'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Staker Royalty (%)'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyStaker.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyStaker')
                      }
                      errorText={
                        formikProps.errors.royaltyStaker
                          ? formikProps.values.royaltyStaker > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyStaker}
                      onChangeText={formikProps.handleChange('royaltyStaker')}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                  </List.Accordion>
                </List.Section>
              </View>

              <View style={styles.actionContainer}>
                <View style={{ height: hp('3%', insets) }} />

                <AppPrimaryButton
                  onPress={formikProps.handleSubmit}
                  loading={isLoading}
                  disabled={!(formikProps.isValid && formikProps.dirty)}
                  style={styles.createAccount}>
                  {t('auth:import')}
                </AppPrimaryButton>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>

      <AppMenuContainer
        tapEverywhereToDismiss
        snapPoints={['60%']}
        visible={utilitySelectorVisible}
        onDismiss={() => setUtilitySelectorVisible(false)}>
        <AppListItem
          onPress={() => console.log('selected')}
          leftContent={
            <AppIconGradient
              name={iconMap.utilityContent}
              colors={[theme.colors.primary, theme.colors.secondary]}
              size={30}
              style={{
                marginRight: wp('3%', insets),
                alignSelf: 'center',
              }}
            />
          }>
          <AppTextHeading3
            numberOfLines={1}
            style={{ width: wp('50%', insets) }}>
            Exclusive Content
          </AppTextHeading3>
          <AppTextBody4
            style={{ color: theme.colors.placeholder }}
            numberOfLines={1}>
            Description of Exclusive Content
          </AppTextBody4>
        </AppListItem>

        <AppListItem
          style={{ opacity: 0.5 }}
          leftContent={
            <AppIconGradient
              name={iconMap.utilityVideoCall}
              colors={[theme.colors.primary, theme.colors.secondary]}
              size={30}
              style={{
                marginRight: wp('3%', insets),
                alignSelf: 'center',
              }}
            />
          }>
          <AppTextHeading3
            numberOfLines={1}
            style={{ width: wp('50%', insets) }}>
            Video Call
          </AppTextHeading3>
          <AppTextBody4
            style={{ color: theme.colors.placeholder }}
            numberOfLines={1}>
            Description of Video Call
          </AppTextBody4>
        </AppListItem>

        <AppListItem
          style={{ opacity: 0.5 }}
          leftContent={
            <AppIconGradient
              name={iconMap.utilityChat}
              colors={[theme.colors.primary, theme.colors.secondary]}
              size={30}
              style={{
                marginRight: wp('3%', insets),
                alignSelf: 'center',
              }}
            />
          }>
          <AppTextHeading3
            numberOfLines={1}
            style={{ width: wp('50%', insets) }}>
            Exclusive Chat
          </AppTextHeading3>
          <AppTextBody4
            style={{ color: theme.colors.placeholder }}
            numberOfLines={1}>
            Description of Exclusive Chat
          </AppTextBody4>
        </AppListItem>

        <AppListItem
          style={{ opacity: 0.5 }}
          leftContent={
            <AppIconGradient
              name={iconMap.utilityGift}
              colors={[theme.colors.primary, theme.colors.secondary]}
              size={30}
              style={{
                marginRight: wp('3%', insets),
                alignSelf: 'center',
              }}
            />
          }>
          <AppTextHeading3
            numberOfLines={1}
            style={{ width: wp('50%', insets) }}>
            Physical Gift
          </AppTextHeading3>
          <AppTextBody4
            style={{ color: theme.colors.placeholder }}
            numberOfLines={1}>
            Description of Physical Gift
          </AppTextBody4>
        </AppListItem>

        <AppListItem
          style={{ opacity: 0.5 }}
          leftContent={
            <AppIconGradient
              name={iconMap.utilityQR}
              colors={[theme.colors.primary, theme.colors.secondary]}
              size={30}
              style={{
                marginRight: wp('3%', insets),
                alignSelf: 'center',
              }}
            />
          }>
          <AppTextHeading3
            numberOfLines={1}
            style={{ width: wp('50%', insets) }}>
            QR Code
          </AppTextHeading3>
          <AppTextBody4
            style={{ color: theme.colors.placeholder }}
            numberOfLines={1}>
            Description of QR Code
          </AppTextBody4>
        </AppListItem>

        <AppListItem
          style={{ opacity: 0.5 }}
          leftContent={
            <AppIconGradient
              name={iconMap.utilityStream}
              colors={[theme.colors.primary, theme.colors.secondary]}
              size={30}
              style={{
                marginRight: wp('3%', insets),
                alignSelf: 'center',
              }}
            />
          }>
          <AppTextHeading3
            numberOfLines={1}
            style={{ width: wp('50%', insets) }}>
            Live Stream
          </AppTextHeading3>
          <AppTextBody4
            style={{ color: theme.colors.placeholder }}
            numberOfLines={1}>
            Description of Live Stream
          </AppTextBody4>
        </AppListItem>
      </AppMenuContainer>
    </AppView>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    accordionListView: {
      flexDirection: 'row',
      marginLeft: wp('1%', insets),
    },
    accordionIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    actionContainer: {
      flexDirection: 'column-reverse',
    },
    createAccount: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
      marginBottom: hp('3%', insets),
    },
    headerImage: {
      fontSize: wp('20%', insets),
      alignSelf: 'center',
    },
    passphraseInput: {
      height: hp('20%', insets),
    },
    passwordView: {
      flex: 0,
    },
    passwordInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
