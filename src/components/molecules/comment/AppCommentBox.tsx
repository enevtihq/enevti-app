import {
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { payCommentCollection } from 'enevti-app/store/middleware/thunk/payment/creator/payCommentCollection';
import { payCommentNFT } from 'enevti-app/store/middleware/thunk/payment/creator/payCommentNFT';
import {
  setCommentById,
  deleteCommentById,
  subtractCommentReplyCountById,
  addCommentReplyCountById,
  addReplyPaginationVersionByCommentId,
  clearReplying,
  getCommentKey,
} from 'enevti-app/store/middleware/thunk/ui/view/comment';
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
import { appSocket } from 'enevti-app/utils/app/network';
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
import { useKeyboard } from 'enevti-app/utils/hook/useKeyboard';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { payReplyCommentClubs } from 'enevti-app/store/middleware/thunk/payment/creator/payReplyCommentClubs';
import { payCommentCollectionClubs } from 'enevti-app/store/middleware/thunk/payment/creator/payCommentCollectionClubs';
import { payCommentNFTClubs } from 'enevti-app/store/middleware/thunk/payment/creator/payCommentNFTClubs';
import AppMentionInput from '../form/AppMentionInput';
import AppMenuMentionInput from '../form/AppMenuMentionInput';
import { payCommentMomentClubs } from 'enevti-app/store/middleware/thunk/payment/creator/payCommentMomentClubs';
import { payCommentMoment } from 'enevti-app/store/middleware/thunk/payment/creator/payCommentMoment';

interface AppCommentBoxProps {
  route: RouteProp<RootStackParamList, 'Comment'>;
  type: 'common' | 'clubs';
  target: string;
  inputRef: React.RefObject<TextInput>;
  withModal?: boolean;
  commentBoxStyle?: StyleProp<ViewStyle>;
}

export default function AppCommentBox({
  route,
  type,
  target,
  inputRef,
  commentBoxStyle,
  withModal = false,
}: AppCommentBoxProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const { keyboardHeight } = useKeyboard();
  const [commentBoxHeight, setCommentBoxHeight] = React.useState<number>(0);
  const [sending, setSending] = React.useState<boolean>(false);

  const abortController = React.useRef<AbortController>();
  const paymentThunkRef = React.useRef<any>();
  const socket = React.useRef<{ [key: string]: Socket | undefined }>({});
  const replySocket = React.useRef<{ [key: string]: Socket | undefined }>({});
  const postCommentTimer = React.useRef<{ [key: string]: any }>({});
  const postReplyTimer = React.useRef<{ [key: string]: any }>({});
  const myPersona = useSelector(selectMyPersonaCache);

  const commentView = useSelector((state: RootState) => selectCommentView(state, getCommentKey(route, type)));
  const commentSession = useSelector((state: RootState) => selectCommentSession(state, target));
  const [value, setValue] = React.useState<string>(() => (commentSession ? commentSession.value : ''));
  const valueRef = React.useRef<string>(value);
  const isReplying = React.useMemo(
    () => commentView.replying !== undefined && commentView.replying > -1,
    [commentView.replying],
  );
  const isReplyingOnReply = React.useMemo(
    () => commentView.replyingOnReply !== undefined && commentView.replyingOnReply > -1,
    [commentView.replyingOnReply],
  );

  const styles = React.useMemo(
    () => makeStyles(theme, insets, keyboardHeight, commentBoxHeight, sending),
    [theme, insets, keyboardHeight, commentBoxHeight, sending],
  );

  const MentionInputComponent = React.useMemo(() => (withModal ? AppMenuMentionInput : AppMentionInput), [withModal]);

  const onReplyClose = React.useCallback(() => {
    dispatch(clearReplying({ route, type }));
  }, [dispatch, route, type]);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.keys(socket.current).forEach(k => socket.current[k]?.disconnect());
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.keys(replySocket.current).forEach(k => replySocket.current[k]?.disconnect());
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.keys(postCommentTimer.current).forEach(k => clearTimeout(postCommentTimer.current[k]));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.keys(postReplyTimer.current).forEach(k => clearTimeout(postReplyTimer.current[k]));
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
      return type === 'common'
        ? paymentStatus.action !== undefined &&
            ['commentCollection', 'commentNFT', 'commentMoment', 'replyComment'].includes(paymentStatus.action) &&
            paymentStatus.key === getCommentKey(route, type)
        : type === 'clubs'
        ? paymentStatus.action !== undefined &&
          ['commentCollectionClubs', 'commentNFTClubs', 'commentMomentClubs', 'replyCommentClubs'].includes(
            paymentStatus.action,
          ) &&
          paymentStatus.key === getCommentKey(route, type)
        : false;
    },
    [route, type],
  );

  const paymentIdleCallback = React.useCallback(() => {
    setSending(false);
  }, []);

  const paymentProcessCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'commentCollection':
        case 'commentNFT':
        case 'commentMoment':
        case 'commentCollectionClubs':
        case 'commentNFTClubs':
        case 'commentMomentClubs':
          dispatch(
            unshiftComment({
              key: getCommentKey(route, type),
              value: [
                {
                  ...makeDummyComment({
                    id: getCommentKey(route, type),
                    isPosting: true,
                    text: value,
                    owner: myPersona,
                  }),
                },
              ],
            }),
          );
          dispatch(addCommentViewPaginationVersion({ key: getCommentKey(route, type) }));
          dispatch(addCommentViewPaginationCheckpoint({ key: getCommentKey(route, type) }));
          break;
        case 'replyComment':
        case 'replyCommentClubs':
          dispatch(setCommentById({ route, type, id: paymentStatus.id, comment: { isPosting: true } }));
          break;
        default:
          break;
      }
      inputRef.current?.clear();
      setValue('');
      valueRef.current = '';
    },
    [dispatch, inputRef, myPersona, route, type, value],
  );

  const paymentSuccessCallback = React.useCallback(
    async (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'commentCollection':
        case 'commentNFT':
        case 'commentMoment':
        case 'commentCollectionClubs':
        case 'commentNFTClubs':
        case 'commentMomentClubs':
          setSending(false);
          dispatch(
            setCommentById({ route, type, id: getCommentKey(route, type), comment: { id: paymentStatus.message } }),
          );

          postCommentTimer.current[paymentStatus.message] = setTimeout(async () => {
            try {
              const status = await getTransactionStatus(paymentStatus.message, abortController.current?.signal);
              if (status.data === 'sent') {
                dispatch(setCommentById({ route, type, id: paymentStatus.message, comment: { isPosting: false } }));
                dispatch(showSnackbar({ mode: 'info', text: t('explorer:commentSuccess') }));
              } else {
                dispatch(deleteCommentById({ route, type, id: paymentStatus.message }));
                dispatch(showSnackbar({ mode: 'info', text: t('explorer:commentQueued') }));
              }
            } catch {
              dispatch(deleteCommentById({ route, type, id: paymentStatus.message }));
              dispatch(showSnackbar({ mode: 'info', text: t('explorer:commentQueued') }));
            } finally {
              socket.current[paymentStatus.message]?.disconnect();
              clearTimeout(postCommentTimer.current[paymentStatus.message]);
              delete socket.current[paymentStatus.message];
              delete postCommentTimer.current[paymentStatus.message];
            }
          }, (await BLOCK_TIME()) * 3);

          socket.current[paymentStatus.message] = appSocket(`transaction:${paymentStatus.message}`);
          socket.current[paymentStatus.message]?.on('processed', () => {
            dispatch(setCommentById({ route, type, id: paymentStatus.message, comment: { isPosting: false } }));
            dispatch(showSnackbar({ mode: 'info', text: t('explorer:commentSuccess') }));
            socket.current[paymentStatus.message]?.disconnect();
            clearTimeout(postCommentTimer.current[paymentStatus.message]);
            delete socket.current[paymentStatus.message];
            delete postCommentTimer.current[paymentStatus.message];
          });
          break;
        case 'replyComment':
        case 'replyCommentClubs':
          setSending(false);
          onReplyClose();

          postReplyTimer.current[paymentStatus.message] = setTimeout(async () => {
            try {
              const status = await getTransactionStatus(paymentStatus.message, abortController.current?.signal);
              if (status.data === 'sent') {
                dispatch(setCommentById({ route, type, id: paymentStatus.id, comment: { isPosting: false } }));
                dispatch(addCommentReplyCountById({ route, type, id: paymentStatus.id }));
                dispatch(addReplyPaginationVersionByCommentId({ route, type, commentId: paymentStatus.id }));
                dispatch(showSnackbar({ mode: 'info', text: t('explorer:replySuccess') }));
              } else {
                dispatch(setCommentById({ route, type, id: paymentStatus.id, comment: { isPosting: false } }));
                dispatch(showSnackbar({ mode: 'info', text: t('explorer:replyQueued') }));
              }
            } catch {
              dispatch(setCommentById({ route, type, id: paymentStatus.id, comment: { isPosting: false } }));
              dispatch(showSnackbar({ mode: 'info', text: t('explorer:replyQueued') }));
            } finally {
              replySocket.current[paymentStatus.message]?.disconnect();
              clearTimeout(postReplyTimer.current[paymentStatus.message]);
              delete replySocket.current[paymentStatus.message];
              delete postReplyTimer.current[paymentStatus.message];
            }
          }, (await BLOCK_TIME()) * 3);

          replySocket.current[paymentStatus.message] = appSocket(`transaction:${paymentStatus.message}`);
          replySocket.current[paymentStatus.message]?.on('processed', () => {
            dispatch(setCommentById({ route, type, id: paymentStatus.id, comment: { isPosting: false } }));
            dispatch(addCommentReplyCountById({ route, type, id: paymentStatus.id }));
            dispatch(addReplyPaginationVersionByCommentId({ route, type, commentId: paymentStatus.id }));
            dispatch(showSnackbar({ mode: 'info', text: t('explorer:replySuccess') }));
            replySocket.current[paymentStatus.message]?.disconnect();
            clearTimeout(postReplyTimer.current[paymentStatus.message]);
            delete replySocket.current[paymentStatus.message];
            delete postReplyTimer.current[paymentStatus.message];
          });
          break;
        default:
          break;
      }
    },
    [dispatch, route, type, onReplyClose, t],
  );

  const paymentErrorCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'commentCollection':
        case 'commentNFT':
        case 'commentMoment':
        case 'commentCollectionClubs':
        case 'commentNFTClubs':
        case 'commentMomentClubs':
          dispatch(shiftComment({ key: getCommentKey(route, type) }));
          dispatch(subtractCommentViewPaginationVersion({ key: getCommentKey(route, type) }));
          dispatch(subtractCommentViewPaginationCheckpoint({ key: getCommentKey(route, type) }));
          break;
        case 'replyComment':
        case 'replyCommentClubs':
          dispatch(subtractCommentReplyCountById({ route, type, id: paymentStatus.id }));
          break;
        default:
          break;
      }
    },
    [dispatch, route, type],
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
      if (type === 'common') {
        paymentThunkRef.current = dispatch(
          payReplyComment({ route, commentId: commentView.comment[commentView.replying!].id, reply: value }),
        );
      } else if (type === 'clubs') {
        paymentThunkRef.current = dispatch(
          payReplyCommentClubs({ route, commentId: commentView.comment[commentView.replying!].id, reply: value }),
        );
      }
    } else {
      if (route.params.type === 'collection') {
        if (type === 'common') {
          paymentThunkRef.current = dispatch(payCommentCollection({ route, comment: value }));
        } else if (type === 'clubs') {
          paymentThunkRef.current = dispatch(payCommentCollectionClubs({ route, comment: value }));
        }
      } else if (route.params.type === 'nft') {
        if (type === 'common') {
          paymentThunkRef.current = dispatch(payCommentNFT({ route, comment: value }));
        } else if (type === 'clubs') {
          paymentThunkRef.current = dispatch(payCommentNFTClubs({ route, comment: value }));
        }
      } else if (route.params.type === 'moment') {
        if (type === 'common') {
          paymentThunkRef.current = dispatch(payCommentMoment({ route, comment: value }));
        } else if (type === 'clubs') {
          paymentThunkRef.current = dispatch(payCommentMomentClubs({ route, comment: value }));
        }
      }
    }
  }, [commentView.comment, commentView.replying, dispatch, isReplying, route, type, value]);

  const commentBoxLayoutHandler = React.useCallback((layout: LayoutChangeEvent) => {
    setCommentBoxHeight(layout.nativeEvent.layout.height);
  }, []);

  return (
    <KeyboardAvoidingView
      enabled={Platform.OS === 'ios' && !withModal ? true : false}
      keyboardVerticalOffset={hp(HEADER_HEIGHT_PERCENTAGE) + hp(TOP_TABBAR_HEIGHT_PERCENTAGE) + insets.top}
      behavior={'position'}
      style={[styles.commentBoxContainer]}>
      <View pointerEvents={sending ? 'none' : 'auto'} style={[styles.commentBox, commentBoxStyle]}>
        <View style={styles.avatarBox}>
          <AppAvatarRenderer size={hp(5)} persona={myPersona} />
        </View>
        <View>
          {isReplying || isReplyingOnReply ? (
            <View style={styles.replyBoxContainer}>
              <View style={styles.replyBox}>
                <AppTextBody4 numberOfLines={1} style={styles.replyBoxText}>
                  {t('explorer:replyTo')}{' '}
                  <AppTextHeading4 numberOfLines={1}>
                    @
                    {isReplyingOnReply
                      ? parsePersonaLabel(
                          commentView.comment[commentView.replying!].replies[commentView.replyingOnReply!].owner,
                        )
                      : parsePersonaLabel(commentView.comment[commentView.replying!].owner)}
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
          <MentionInputComponent
            inputRef={inputRef}
            onLayout={commentBoxLayoutHandler}
            value={value}
            onChange={e => {
              setValue(e);
              valueRef.current = e;
            }}
            placeholder={t('explorer:commentPlaceholder')}
            style={styles.commentInput}
          />
        </View>
        <View style={styles.commentActionContainer}>
          {!sending ? (
            <>
              {value.length > 0 ? <View style={styles.commentActionBg} /> : null}
              <AppIconButton
                icon={iconMap.sendPost}
                color={value.length > 0 ? theme.colors.primary : theme.colors.placeholder}
                size={hp(4)}
                onPress={value.length > 0 ? onComment : undefined}
              />
            </>
          ) : (
            <AppActivityIndicator animating size={hp(3)} style={{ bottom: hp(1), right: hp(1) }} />
          )}
        </View>
      </View>
      <View style={styles.bottomBar} />
    </KeyboardAvoidingView>
  );
}

const makeStyles = (
  theme: Theme,
  insets: SafeAreaInsets,
  keyboardHeight: number,
  commentBoxHeight: number,
  sending: boolean,
) =>
  StyleSheet.create({
    commentBoxContainer: {
      position: 'absolute',
      bottom: 0,
      marginBottom: Platform.OS === 'ios' ? undefined : hp(2) + insets.bottom,
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    commentBox: {
      backgroundColor: theme.colors.background,
      borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
      borderTopWidth: 1,
      opacity: sending ? 0.5 : 1,
    },
    bottomBar: {
      position: 'absolute',
      bottom: keyboardHeight ? -keyboardHeight : -hp(4),
      height: keyboardHeight ? keyboardHeight : hp(4),
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    avatarBox: {
      position: 'absolute',
      bottom: hp(1),
      left: wp(3),
    },
    commentInput: {
      marginTop: Platform.OS === 'ios' ? hp(2) : undefined,
      marginLeft: wp(15),
      marginRight: wp(15),
      minHeight: hp(6),
      maxHeight: hp(14),
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular.fontFamily,
    },
    commentActionContainer: {
      position: 'absolute',
      bottom: hp(1),
      right: wp(4),
      justifyContent: 'center',
    },
    commentActionBg: {
      position: 'absolute',
      backgroundColor: 'white',
      width: '50%',
      height: '50%',
      alignSelf: 'center',
      borderRadius: hp(4),
    },
    replyBoxContainer: {
      position: 'absolute',
      bottom: commentBoxHeight + (Platform.OS === 'ios' ? hp(2) : 0),
      width: '100%',
      height: hp(5),
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    replyBox: {
      alignItems: 'center',
      flexDirection: 'row',
      height: '100%',
      paddingHorizontal: wp(3),
      backgroundColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
    },
    replyBoxText: {
      flex: 1,
    },
  });
