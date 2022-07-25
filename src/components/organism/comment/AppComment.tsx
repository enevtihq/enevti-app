import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppCommentItem from 'enevti-app/components/molecules/comment/AppCommentItem';
import AppCommentBox from 'enevti-app/components/molecules/comment/AppCommentBox';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { loadComment, unloadComment } from 'enevti-app/store/middleware/thunk/ui/view/comment';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'enevti-app/store/state';
import { isCommentUndefined } from 'enevti-app/store/slices/ui/view/comment';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppCommentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Comment'>;
}

export default function AppComment({ route }: AppCommentProps) {
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);

  const commentUndefined = useSelector((state: RootState) => isCommentUndefined(state, route.key));

  const onCommentScreenLoaded = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadComment({ route, reload }));
    },
    [dispatch, route],
  ) as AppAsyncThunk;

  React.useEffect(() => {
    const promise = onCommentScreenLoaded();
    return function cleanup() {
      dispatch(unloadComment(route));
      promise.abort();
    };
  }, [dispatch, route, onCommentScreenLoaded]);

  return !commentUndefined ? (
    <View style={styles.container}>
      <AppCommentItem />
      {/* <AppCommentItem />
      <AppCommentItem />
      <AppCommentItem /> */}
      <AppCommentBox route={route} />
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  });
