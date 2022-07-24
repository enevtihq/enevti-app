import { Platform, Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';
import { useDebouncedCallback } from 'use-debounce';
import { Persona } from 'enevti-app/types/core/account/persona';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { CollectionTag, getTagCollection, getTagUsername } from 'enevti-app/service/enevti/tag';
import { handleError } from 'enevti-app/utils/error/handle';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import AppListItem from '../list/AppListItem';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';

export default function AppCommentBox() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const abortController = React.useRef<AbortController>();
  const myPersona = useSelector(selectMyPersonaCache);

  const [value, setValue] = React.useState<string>('');
  const [isError, setIsError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    abortController.current = new AbortController();
    return () => {
      abortController.current && abortController.current.abort();
    };
  }, []);

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
                  <AppAvatarRenderer persona={suggestion} size={wp('12%', insets)} style={styles.avatar} />
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

  return (
    <View style={styles.commentBoxContainer}>
      <View>
        <View style={styles.avatarBox}>
          <AppAvatarRenderer size={hp(5, insets)} persona={myPersona} />
        </View>
        <View>
          <MentionInput
            value={value}
            onChange={e => {
              setLoading(true);
              setValue(e);
            }}
            placeholder={'Tag username with "@", collection with "$", or NFT with "*"'}
            placeholderTextColor={theme.colors.placeholder}
            style={styles.commentInput}
            partTypes={[
              {
                trigger: '@',
                renderSuggestions: renderUsernameSuggestions,
                textStyle: { fontWeight: 'bold', color: theme.colors.link },
              },
            ]}
          />
        </View>
        <View style={styles.commentActionContainer}>
          <View style={styles.commentActionBg} />
          <AppIconButton icon={iconMap.sendPost} color={theme.colors.primary} size={hp(4, insets)} onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    commentBoxContainer: {
      position: 'absolute',
      width: '100%',
      backgroundColor: theme.colors.background,
      bottom: 0,
      paddingBottom: hp(2, insets) + insets.bottom,
      borderColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
      borderTopWidth: 1,
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
