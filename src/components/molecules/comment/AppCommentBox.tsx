import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
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
import { payCommentNFT } from 'enevti-app/store/middleware/thunk/payment/creator/payCommentNFT';
import { setCommentById, deleteCommentById, resetReplying } from 'enevti-app/store/middleware/thunk/ui/view/comment';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import {
  addCommentViewPaginationCheckpoint,
  addCommentViewPaginationVersion,
  selectCommentView,
  shiftComment,
  subtractCommentViewPaginationCheckpoint,
  subtractCommentViewPaginationVersion,
  unshiftComment,
} from 'enevti-app/store/slices/ui/view/comment';
import { makeDummyComment } from 'enevti-app/utils/dummy/comment';
import { Socket } from 'socket.io-client';
import { appSocket } from 'enevti-app/utils/network';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import {
  clearCommentSessionByKey,
  selectCommentSession,
  setCommentSession,
} from 'enevti-app/store/slices/session/engagement/comment';
import { RootState } from 'enevti-app/store/state';
import { BLOCK_TIME } from 'enevti-app/utils/constant/identifier';
import { getTransactionStatus } from 'enevti-app/service/enevti/transaction';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { payReplyComment } from 'enevti-app/store/middleware/thunk/payment/creator/payReplyComment';

interface AppCommentBoxProps {
  route: RouteProp<RootStackParamList, 'Comment'>;
  target: string;
  inputRef: React.RefObject<TextInput>;
}

export default function AppCommentBox({ route, target, inputRef }: AppCommentBoxProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const abortController = React.useRef<AbortController>();
  const paymentThunkRef = React.useRef<any>();
  const socket = React.useRef<Socket | undefined>();
  const postCommentTimer = React.useRef<any>();
  const myPersona = useSelector(selectMyPersonaCache);

  const commentView = useSelector((state: RootState) => selectCommentView(state, route.key));
  const commentSession = useSelector((state: RootState) => selectCommentSession(state, target));
  const [value, setValue] = React.useState<string>(() => (commentSession ? commentSession.value : ''));
  const valueRef = React.useRef<string>(value);
  const isReplying = React.useMemo(
    () => commentView.replying !== undefined && commentView.replying > -1,
    [commentView.replying],
  );

  const [isError, setIsError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sending, setSending] = React.useState<boolean>(false);

  const onReplyClose = React.useCallback(() => {
    dispatch(resetReplying({ route }));
  }, [dispatch, route]);

  React.useEffect(() => {
    if (isReplying) {
      inputRef.current?.focus();
    } else {
      Keyboard.dismiss();
    }
  }, [commentView.replying, inputRef, isReplying]);

  React.useEffect(() => {
    abortController.current = new AbortController();
    return () => {
      abortController.current && abortController.current.abort();
      socket.current?.disconnect();
      clearTimeout(postCommentTimer.current);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (valueRef.current) {
        dispatch(setCommentSession({ key: target, value: { value: valueRef.current } }));
      } else {
        dispatch(clearCommentSessionByKey(target));
      }
    };
  }, [dispatch, target]);

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['commentCollection', 'commentNFT', 'likeComment', 'likeReply', 'replyComment'].includes(
          paymentStatus.action,
        ) &&
        paymentStatus.id === route.params.arg &&
        paymentStatus.key === route.key
      );
    },
    [route.key, route.params.arg],
  );

  const paymentIdleCallback = React.useCallback((paymentStatus: PaymentStatus) => {
    switch (paymentStatus.action) {
      case 'commentCollection':
      case 'commentNFT':
        setSending(false);
        break;
      default:
        break;
    }
  }, []);

  const paymentProcessCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'commentCollection':
        case 'commentNFT':
          dispatch(
            unshiftComment({
              key: route.key,
              value: [{ ...makeDummyComment({ id: route.key, isPosting: true, text: value, owner: myPersona }) }],
            }),
          );
          dispatch(addCommentViewPaginationVersion({ key: route.key }));
          dispatch(addCommentViewPaginationCheckpoint({ key: route.key }));
          break;
        default:
          break;
      }
      inputRef.current?.clear();
      valueRef.current = '';
    },
    [dispatch, inputRef, myPersona, route.key, value],
  );

  const paymentSuccessCallback = React.useCallback(
    async (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'commentCollection':
        case 'commentNFT':
          setSending(false);
          dispatch(setCommentById({ route, id: route.key, comment: { id: paymentStatus.message } }));

          postCommentTimer.current = setTimeout(async () => {
            const status = await getTransactionStatus(paymentStatus.message, abortController.current?.signal);
            if (status.data === 'sent') {
              dispatch(setCommentById({ route, id: paymentStatus.message, comment: { isPosting: false } }));
              dispatch(showSnackbar({ mode: 'info', text: t('explorer:commentSuccess') }));
            } else {
              dispatch(deleteCommentById({ route, id: paymentStatus.message }));
              dispatch(showSnackbar({ mode: 'info', text: t('explorer:commentQueued') }));
            }
            socket.current?.disconnect();
          }, (await BLOCK_TIME()) * 5);

          socket.current = appSocket(`transaction:${paymentStatus.message}`);
          socket.current.on('processed', () => {
            dispatch(setCommentById({ route, id: paymentStatus.message, comment: { isPosting: false } }));
            dispatch(showSnackbar({ mode: 'info', text: t('explorer:commentSuccess') }));
            socket.current?.disconnect();
            clearTimeout(postCommentTimer.current);
          });
          break;
        default:
          break;
      }
    },
    [dispatch, route, t],
  );

  const paymentErrorCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'commentCollection':
        case 'commentNFT':
          dispatch(shiftComment({ key: route.key }));
          dispatch(subtractCommentViewPaginationVersion({ key: route.key }));
          dispatch(subtractCommentViewPaginationCheckpoint({ key: route.key }));
          break;
        default:
          break;
      }
    },
    [dispatch, route.key],
  );

  usePaymentCallback({
    condition: paymentCondition,
    onIdle: paymentIdleCallback,
    onProcess: paymentProcessCallback,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

  const onComment = React.useCallback(() => {
    Keyboard.dismiss();
    setSending(true);
    if (isReplying) {
      paymentThunkRef.current = dispatch(
        payReplyComment({ route, commentId: commentView.comment[commentView.replying!].id, reply: value }),
      );
    } else {
      if (route.params.type === 'collection') {
        paymentThunkRef.current = dispatch(payCommentCollection({ route, comment: value }));
      } else if (route.params.type === 'nft') {
        paymentThunkRef.current = dispatch(payCommentNFT({ route, comment: value }));
      }
    }
  }, [commentView.comment, commentView.replying, dispatch, isReplying, route, value]);

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
          {isReplying ? (
            <View style={styles.replyBoxContainer}>
              <View style={styles.replyBox}>
                <AppTextBody4 numberOfLines={1} style={styles.replyBoxText}>
                  {t('explorer:replyTo')}{' '}
                  <AppTextHeading4 numberOfLines={1}>
                    @{parsePersonaLabel(commentView.comment[commentView.replying!].owner)}
                  </AppTextHeading4>
                </AppTextBody4>
                <AppIconButton
                  onPress={onReplyClose}
                  color={theme.colors.placeholder}
                  size={hp(2.5)}
                  icon={iconMap.remove}
                />
              </View>
            </View>
          ) : null}
          <MentionInput
            inputRef={inputRef}
            value={value}
            onChange={e => {
              setLoading(true);
              setValue(e);
              valueRef.current = e;
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
              {value.length > 0 ? <View style={styles.commentActionBg} /> : null}
              <AppIconButton
                icon={iconMap.sendPost}
                color={value.length > 0 ? theme.colors.primary : theme.colors.placeholder}
                size={hp(4, insets)}
                onPress={value.length > 0 ? onComment : undefined}
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
      backgroundColor: theme.colors.background,
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
    replyBoxContainer: {
      position: 'absolute',
      bottom: hp(7),
      width: '100%',
      height: hp(5),
      paddingHorizontal: wp(3),
      justifyContent: 'center',
      backgroundColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
    },
    replyBox: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    replyBoxText: {
      flex: 1,
    },
  });
