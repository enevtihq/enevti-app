import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';
import { useDebouncedCallback } from 'use-debounce';
import { Persona } from 'enevti-app/types/core/account/persona';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { CollectionTag, getTagCollection, getTagNFT, getTagUsername } from 'enevti-app/service/enevti/tag';
import { handleError } from 'enevti-app/utils/error/handle';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import AppListItem from '../list/AppListItem';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import AppNFTRenderer from '../nft/AppNFTRenderer';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { payCommentCollection } from 'enevti-app/store/middleware/thunk/payment/creator/payCommentCollection';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import { unshiftComment } from 'enevti-app/store/slices/ui/view/comment';
import { makeDummyComment } from 'enevti-app/utils/dummy/comment';

interface AppCommentBoxProps {
  route: RouteProp<RootStackParamList, 'Comment'>;
}

export default function AppCommentBox({ route }: AppCommentBoxProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const abortController = React.useRef<AbortController>();
  const paymentThunkRef = React.useRef<any>();
  const inputRef = React.useRef<any>();
  const myPersona = useSelector(selectMyPersonaCache);

  const [value, setValue] = React.useState<string>('');
  const [isError, setIsError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sending, setSending] = React.useState<boolean>(false);

  React.useEffect(() => {
    abortController.current = new AbortController();
    return () => {
      abortController.current && abortController.current.abort();
    };
  }, []);

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['commentCollection', 'commentNFT'].includes(paymentStatus.action) &&
        paymentStatus.id === route.params.arg &&
        paymentStatus.key === route.key
      );
    },
    [route.key, route.params.arg],
  );

  const paymentInitiatedCallback = React.useCallback(() => {
    setSending(false);
  }, []);

  const paymentProcessCallback = React.useCallback(() => {
    dispatch(
      unshiftComment({
        key: route.key,
        value: [{ ...makeDummyComment({ isPosting: true, text: value, owner: myPersona }) }],
      }),
    );
    inputRef.current?.clear();
    // TODO: listen socket for transaction processed in the blockchain
  }, [dispatch, myPersona, route.key, value]);

  usePaymentCallback({
    condition: paymentCondition,
    onInitiated: paymentInitiatedCallback,
    onProcess: paymentProcessCallback,
  });

  const onComment = React.useCallback(() => {
    Keyboard.dismiss();
    setSending(true);
    if (route.params.type === 'collection') {
      paymentThunkRef.current = dispatch(payCommentCollection({ route, comment: value }));
    }
  }, [dispatch, route, value]);

  const SuggestionError = React.useMemo(
    () => (
      <View style={styles.suggestionContainer}>
        <AppTextBody4 style={styles.suggestionError}>{t('error:clientError')}</AppTextBody4>
      </View>
    ),
    [styles.suggestionContainer, styles.suggestionError, t],
  );

  const SuggestionLoading = React.useMemo(
    () => (
      <View style={styles.suggestionContainer}>
        <AppActivityIndicator animating />
      </View>
    ),
    [styles.suggestionContainer],
  );

  const SuggestionNotFound = React.useMemo(
    () => (
      <View style={styles.suggestionContainer}>
        <AppTextBody4 style={styles.suggestionInfo}>{t('error:notFound')}</AppTextBody4>
      </View>
    ),
    [styles.suggestionContainer, styles.suggestionInfo, t],
  );

  const [usernameSuggestion, setUsernameSuggestion] = React.useState<Persona[]>([]);
  const debouncedSetUsernameSuggestion = useDebouncedCallback(async (keyword: string) => {
    try {
      if (loading) {
        const personaResponse = await getTagUsername(
          keyword,
          abortController.current ? abortController.current.signal : undefined,
        );
        if (personaResponse.status !== 200) {
          setIsError(true);
        }
        setUsernameSuggestion(personaResponse.data);
        setLoading(false);
        setIsError(false);
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, 1000);

  const renderUsernameSuggestions: React.FC<MentionSuggestionsProps> = React.useCallback(
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      debouncedSetUsernameSuggestion(keyword);

      if (isError) {
        return SuggestionError;
      }
      if (loading) {
        return SuggestionLoading;
      }
      if (usernameSuggestion.length === 0) {
        return SuggestionNotFound;
      }

      return (
        <View style={styles.suggestionSuccess}>
          {usernameSuggestion.map(suggestion => (
            <AppListItem
              key={suggestion.address}
              onPress={() => onSuggestionPress({ id: suggestion.address, name: suggestion.username })}
              containerStyle={styles.accountCard}
              leftContent={
                <View style={styles.collectionCoverContainer}>
                  <AppAvatarRenderer persona={suggestion} size={hp(5, insets)} style={styles.avatar} />
                </View>
              }>
              <AppTextHeading3 numberOfLines={1}>{parsePersonaLabel(suggestion)}</AppTextHeading3>
              {suggestion.username ? (
                <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
                  {suggestion.base32}
                </AppTextBody4>
              ) : null}
            </AppListItem>
          ))}
        </View>
      );
    },
    [
      SuggestionError,
      SuggestionLoading,
      SuggestionNotFound,
      debouncedSetUsernameSuggestion,
      insets,
      isError,
      loading,
      styles.accountCard,
      styles.avatar,
      styles.collectionCoverContainer,
      styles.suggestionSuccess,
      theme.colors.placeholder,
      usernameSuggestion,
    ],
  );

  const [collectionSuggestion, setCollectionSuggestion] = React.useState<CollectionTag[]>([]);
  const debouncedSetCollectionSuggestion = useDebouncedCallback(async (keyword: string) => {
    try {
      if (loading) {
        const collectionResponse = await getTagCollection(
          keyword,
          abortController.current ? abortController.current.signal : undefined,
        );
        if (collectionResponse.status !== 200) {
          setIsError(true);
        }
        setCollectionSuggestion(collectionResponse.data);
        setLoading(false);
        setIsError(false);
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, 1000);

  const renderCollectionSuggestions: React.FC<MentionSuggestionsProps> = React.useCallback(
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      debouncedSetCollectionSuggestion(keyword);

      if (isError) {
        return SuggestionError;
      }
      if (loading) {
        return SuggestionLoading;
      }
      if (collectionSuggestion.length === 0) {
        return SuggestionNotFound;
      }

      return (
        <View style={styles.suggestionSuccess}>
          {collectionSuggestion.map(suggestion => (
            <AppListItem
              key={suggestion.id}
              onPress={() => onSuggestionPress({ id: suggestion.id, name: suggestion.name })}
              containerStyle={styles.accountCard}
              leftContent={
                <View style={styles.collectionCoverContainer}>
                  <AppNetworkImage
                    style={{ width: hp(5, insets), height: hp(5, insets) }}
                    url={IPFStoURL(suggestion.cover.cid)}
                  />
                </View>
              }>
              <AppTextHeading3 numberOfLines={1}>
                {suggestion.name} ({suggestion.symbol})
              </AppTextHeading3>
              <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
                {t('explorer:createdBy', { creator: parsePersonaLabel(suggestion.creator) })}
              </AppTextBody4>
            </AppListItem>
          ))}
        </View>
      );
    },
    [
      SuggestionError,
      SuggestionLoading,
      SuggestionNotFound,
      collectionSuggestion,
      debouncedSetCollectionSuggestion,
      insets,
      isError,
      loading,
      styles.accountCard,
      styles.collectionCoverContainer,
      styles.suggestionSuccess,
      t,
      theme.colors.placeholder,
    ],
  );

  const [NFTSuggestion, setNFTSuggestion] = React.useState<(NFTBase & { owner: Persona })[]>([]);
  const debouncedSetNFTSuggestion = useDebouncedCallback(async (keyword: string) => {
    try {
      if (loading) {
        const nftResponse = await getTagNFT(
          keyword,
          abortController.current ? abortController.current.signal : undefined,
        );
        if (nftResponse.status !== 200) {
          setIsError(true);
        }
        setNFTSuggestion(nftResponse.data);
        setLoading(false);
        setIsError(false);
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, 1000);

  const renderNFTSuggestions: React.FC<MentionSuggestionsProps> = React.useCallback(
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      debouncedSetNFTSuggestion(keyword);

      if (isError) {
        return SuggestionError;
      }
      if (loading) {
        return SuggestionLoading;
      }
      if (NFTSuggestion.length === 0) {
        return SuggestionNotFound;
      }

      return (
        <View style={styles.suggestionSuccess}>
          {NFTSuggestion.map(suggestion => (
            <AppListItem
              key={suggestion.id}
              onPress={() =>
                onSuggestionPress({ id: suggestion.id, name: `${suggestion.symbol}#${suggestion.serial}` })
              }
              containerStyle={styles.accountCard}
              leftContent={
                <View style={styles.collectionCoverContainer}>
                  <View style={{ height: hp(5, insets), width: hp(5, insets) }}>
                    <AppNFTRenderer nft={suggestion} width={hp(5, insets)} />
                  </View>
                </View>
              }>
              <AppTextHeading3 numberOfLines={1}>
                {suggestion.symbol}#{suggestion.serial}
              </AppTextHeading3>
              <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
                {suggestion.owner.address ? parsePersonaLabel(suggestion.owner) : t('explorer:notMinted')}
              </AppTextBody4>
            </AppListItem>
          ))}
        </View>
      );
    },
    [
      NFTSuggestion,
      SuggestionError,
      SuggestionLoading,
      SuggestionNotFound,
      debouncedSetNFTSuggestion,
      insets,
      isError,
      loading,
      styles.accountCard,
      styles.collectionCoverContainer,
      styles.suggestionSuccess,
      t,
      theme.colors.placeholder,
    ],
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={[styles.commentBoxContainer]}>
      <View style={styles.commentBox}>
        <View style={styles.avatarBox}>
          <AppAvatarRenderer size={hp(5, insets)} persona={myPersona} />
        </View>
        <View>
          <MentionInput
            inputRef={inputRef}
            value={value}
            onChange={e => {
              setLoading(true);
              setValue(e);
            }}
            placeholder={t('explorer:commentPlaceholder')}
            placeholderTextColor={theme.colors.placeholder}
            style={styles.commentInput}
            partTypes={[
              {
                trigger: '@',
                renderSuggestions: renderUsernameSuggestions,
                textStyle: { fontWeight: 'bold', color: theme.colors.link },
              },
              {
                trigger: '$',
                renderSuggestions: renderCollectionSuggestions,
                textStyle: { fontWeight: 'bold', color: theme.colors.link },
                allowedSpacesCount: 20,
              },
              {
                trigger: '*',
                renderSuggestions: renderNFTSuggestions,
                textStyle: { fontWeight: 'bold', color: theme.colors.link },
              },
            ]}
          />
        </View>
        <View style={styles.commentActionContainer}>
          {!sending ? (
            <>
              <View style={styles.commentActionBg} />
              <AppIconButton
                icon={iconMap.sendPost}
                color={theme.colors.primary}
                size={hp(4, insets)}
                onPress={onComment}
              />
            </>
          ) : (
            <AppActivityIndicator
              animating
              size={hp(3, insets)}
              style={{ bottom: hp(1, insets), right: hp(1, insets) }}
            />
          )}
        </View>
      </View>
      <View style={styles.bottomBar} />
    </KeyboardAvoidingView>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    commentBoxContainer: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      marginBottom: Platform.OS === 'ios' ? undefined : hp(2, insets) + insets.bottom,
    },
    commentBox: {
      backgroundColor: theme.colors.background,
      borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
      borderTopWidth: 1,
    },
    bottomBar: {
      position: 'absolute',
      bottom: -(hp(2, insets) + insets.bottom),
      height: hp(2, insets) + insets.bottom,
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    avatarBox: {
      position: 'absolute',
      bottom: hp(1, insets),
      left: wp(3, insets),
    },
    commentInput: {
      marginTop: Platform.OS === 'ios' ? hp(2, insets) : undefined,
      marginLeft: wp(15, insets),
      marginRight: wp(15, insets),
      minHeight: hp(6, insets),
      maxHeight: hp(14, insets),
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular.fontFamily,
    },
    commentActionContainer: {
      position: 'absolute',
      bottom: hp(1, insets),
      right: wp(4, insets),
      justifyContent: 'center',
    },
    commentActionBg: {
      position: 'absolute',
      backgroundColor: 'white',
      width: '50%',
      height: '50%',
      alignSelf: 'center',
      borderRadius: hp(4, insets),
    },
    suggestionContainer: {
      padding: hp(2, insets),
      borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
      borderBottomWidth: 1,
    },
    suggestionError: {
      color: theme.colors.error,
      alignSelf: 'center',
    },
    suggestionInfo: {
      alignSelf: 'center',
    },
    suggestionSuccess: {
      borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
      borderBottomWidth: 1,
    },
    accountCard: {
      marginHorizontal: 0,
      marginVertical: 0,
      backgroundColor: theme.colors.background,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: undefined,
    },
    collectionCoverContainer: {
      marginRight: wp('3%', insets),
      overflow: 'hidden',
      alignSelf: 'center',
    },
    avatar: {
      alignSelf: 'center',
    },
  });
