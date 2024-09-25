// import { notifRoutines } from '@data/notifRoutines';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import navigate, { goBack } from '@navigation/NavigationService';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// import { sendMessage } from '@api/user/sendMessage';
import { lang } from '@i18n';

import Alert from '@modals/Alert';

import { store } from '@store';
import { setUserInfo } from '@store/user.reducer';
// import { setSkipped } from '@store/general.reducer';
// import { resetQuestions } from '@store/question.reducer';
// import { resetQuizes } from '@store/quiz.reducer';
// import { resetUser } from '@store/user.reducer';

const GOOGLE_CLIENT_ID = '389617122363-ts4emn73uh0srfu3mf56tqepl1fqop71.apps.googleusercontent.com';

export const setGoogleSigninWebClientId = () => {
  GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID });
};

export const googleSignin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken, user } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);
    user?.givenName && (await updateUsername(user?.givenName));
  } catch (error) {
    console.warn(`[googleSignin] error in googleSignin === ${JSON.stringify(error)}`);
  }
};

export const appleSignin = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }
    const { identityToken, nonce, fullName } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
    await auth().signInWithCredential(appleCredential);
    fullName?.givenName && (await updateUsername(fullName?.givenName));
  } catch (error) {
    console.warn(`[Apple] error in Apple === ${JSON.stringify(error)}`);
  }
};

export const linkUserWithCredential = async (email: string, password: string) => {
  try {
    let currentUser = auth().currentUser;
    // Link with email and password credential
    const credential = auth.EmailAuthProvider.credential(email, password);
    const userCredential = await currentUser?.linkWithCredential(credential);
    // User is now signed up and signed in with email and password
    const user = userCredential?.user;
    return user;
  } catch (error) {
    // @ts-ignore
    navigate(Alert.name, {
      // @ts-ignore
      customMessage: { body: error?.message, title: lang.error, type: 'error' },
    });
  }
};

export const signUpEmail = async (email: string, password: string) => {
  try {
    const res = await auth().createUserWithEmailAndPassword(email, password);
    return res;
  } catch (error) {
    // @ts-ignore
    if (error?.code === 'auth/email-already-in-use') {
      return signInEmail(email, password);
    } else {
      navigate(Alert.name, {
        // @ts-ignore
        customMessage: { body: error?.message, title: lang.error, type: 'error' },
      });
    }
  }
};

export const signInEmail = async (email: string, password: string) => {
  try {
    const res = await auth().signInWithEmailAndPassword(email, password);
    return res;
  } catch (error) {
    // @ts-ignore
    navigate(Alert.name, { customMessage: { body: error?.message, title: lang.error, type: 'error' } });
  }
};

export const anonymousSignin = async () => {
  try {
    await auth().signInAnonymously();
  } catch (error) {
    console.warn(`[anonymousSignin] error in anonymousSignin === ${JSON.stringify(error)}`);
  }
};

export const updateUsername = async (displayName: string) => {
  try {
    store.dispatch(setUserInfo({ displayName }));
    await auth()?.currentUser?.updateProfile({ displayName });
  } catch (error) {
    console.warn(`[googleSignin] error in updateUsername === ${JSON.stringify(error)}`);
  }
};

export const signOut = async () => {
  try {
    // const { user } = store.getState();
    // const { userData } = user;

    await auth().signOut();
    // store.dispatch(setSkipped(false));
    // userData.pair && (await sendMessage(notifRoutines.remove_partnership));
    // store.dispatch(resetQuestions());
    // store.dispatch(resetQuizes());
    // store.dispatch(resetUser());
    goBack();
  } catch {
    console.error('error');
  }
};
