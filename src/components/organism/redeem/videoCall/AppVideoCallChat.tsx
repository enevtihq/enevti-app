import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeader, { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTheme } from 'react-native-paper';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Persona } from 'enevti-app/types/core/account/persona';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import { compactBase32Address, parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import Color from 'color';
import { ChatMessage } from 'enevti-app/types/core/service/call';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import moment from 'moment';
import AppFormTextInputWithError from 'enevti-app/components/molecules/AppFormTextInputWithError';
import { useTranslation } from 'react-i18next';

const FLEX_END = 'flex-end';
const FLEX_START = 'flex-start';

interface AppVideoCallChatProps {
  chat: ChatMessage[];
  visible: boolean;
  onDismiss: () => void;
  onSendChat: (message: string) => void;
  myPublicKey: string;
  participantPersona?: Persona;
}

export default function AppVideoCallChat({
  chat,
  visible,
  participantPersona,
  myPublicKey,
  onDismiss,
  onSendChat,
}: AppVideoCallChatProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const snapPoints = React.useMemo(() => ['105%'], []);
  const headerMarginTop = React.useMemo(() => (Platform.OS === 'ios' ? hp(3) : hp(1)), []);
  const [value, setValue] = React.useState<string>('');

  const onSend = React.useCallback(() => {
    onSendChat(value);
    setValue('');
  }, [onSendChat, value]);

  const headerComponent = React.useMemo(
    () => (
      <View style={styles.headerContainer}>
        <AppTextBody5 style={styles.headerText}>{t('redeem:VCChatHeader')}</AppTextBody5>
      </View>
    ),
    [styles.headerContainer, styles.headerText, t],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: ChatMessage; index: number }) => (
      <View style={{ alignItems: item.sender === myPublicKey ? FLEX_END : FLEX_START }}>
        <View
          style={[
            styles.chatContainer,
            {
              backgroundColor:
                item.sender === myPublicKey
                  ? theme.dark
                    ? Color(theme.colors.primary).alpha(0.5).rgb().toString()
                    : Color(theme.colors.primary).alpha(0.2).rgb().toString()
                  : theme.dark
                  ? Color(theme.colors.background).lighten(1.5).rgb().toString()
                  : Color(theme.colors.background).darken(0.1).rgb().toString(),
            },
          ]}>
          <AppTextBody4 style={styles.chat}>{item.message}</AppTextBody4>
          <AppTextBody5 style={styles.timestamp}>{moment(item.timestamp).format('HH:mm')}</AppTextBody5>
        </View>
      </View>
    ),
    [
      myPublicKey,
      styles.chat,
      styles.chatContainer,
      styles.timestamp,
      theme.colors.background,
      theme.colors.primary,
      theme.dark,
    ],
  );

  const keyExtractor = React.useCallback((_, index) => index, []);

  return (
    <AppMenuContainer
      enableContentPanningGesture={false}
      tapEverywhereToDismiss={false}
      enablePanDownToClose={false}
      visible={visible}
      onDismiss={onDismiss}
      snapPoints={snapPoints}
      backgroundStyle={styles.containerBackground}>
      <AppHeader
        backgroundStyle={styles.header}
        marginTop={headerMarginTop}
        backComponent={
          <AppIconButton
            icon={iconMap.close}
            size={Platform.OS === 'ios' ? 30 : 20}
            color={theme.colors.text}
            onPress={onDismiss}
            style={styles.customBackIcon}
          />
        }
        leftComponent={<AppAvatarRenderer persona={participantPersona} size={hp(4)} style={styles.customBackIcon} />}
        title={participantPersona ? parsePersonaLabel(participantPersona) : undefined}
        textStyle={{ fontSize: hp(2) }}
        subtitleStyle={{ fontSize: hp(1.5) }}
        subtitle={
          participantPersona && participantPersona.username
            ? compactBase32Address(participantPersona.base32)
            : undefined
        }
      />
      <View style={{ height: hp(HEADER_HEIGHT_PERCENTAGE) + headerMarginTop }} />
      <FlatList
        inverted
        style={{ paddingHorizontal: wp(5) }}
        contentContainerStyle={styles.chatListContent}
        scrollEventThrottle={16}
        data={chat}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={headerComponent}
      />
      <KeyboardAvoidingView enabled={Platform.OS === 'ios' ? true : false} behavior={'padding'}>
        <View style={styles.inputBoxContainerView}>
          <AppFormTextInputWithError
            dense
            hideMaxLengthIndicator
            multiline
            theme={theme as any}
            onChangeText={text => setValue(text)}
            value={value}
            label={t('redeem:VCChatPlaceholder')}
            style={styles.inputBox}
            onSubmitEditing={value.length > 0 ? onSend : undefined}
            returnKeyType={'send'}
          />
          <View style={styles.sendBox}>
            <AppIconButton
              disabled={value.length > 0 ? false : true}
              icon={iconMap.sendPost}
              color={value.length > 0 ? theme.colors.primary : theme.colors.placeholder}
              size={hp(4, insets)}
              onPress={value.length > 0 ? onSend : undefined}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppMenuContainer>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    headerContainer: {
      paddingVertical: hp(1),
      paddingHorizontal: wp(5),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.2).rgb().toString(),
      borderRadius: wp(5),
      width: wp(60),
      alignSelf: 'center',
      marginBottom: hp(3),
    },
    headerText: {
      textAlign: 'center',
    },
    chatListContent: {
      flexDirection: 'column-reverse',
    },
    containerBackground: {
      backgroundColor: Color(theme.colors.background).lighten(0.3).alpha(0.95).rgb().toString(),
    },
    inputBoxContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
    inputBoxContainerView: {
      flexDirection: 'row',
      paddingHorizontal: wp(5),
      paddingTop: hp(1),
      paddingBottom: Platform.OS === 'ios' ? insets.bottom : hp(2, insets) + insets.bottom,
      backgroundColor: theme.colors.background,
    },
    inputBox: {
      flex: 1,
      maxHeight: hp(15),
    },
    sendBox: {
      justifyContent: 'center',
      borderRadius: wp(5),
      overflow: 'hidden',
    },
    customBackIcon: {
      marginLeft: wp('3%', insets),
    },
    header: {
      backgroundColor: 'transparent',
    },
    chatContainer: {
      minWidth: wp(30),
      maxWidth: wp(80),
      paddingHorizontal: wp(3),
      paddingVertical: wp(2),
      borderRadius: wp(5),
      marginBottom: hp(1),
    },
    chat: {
      marginRight: wp(10),
    },
    timestamp: {
      textAlign: 'right',
    },
  });
