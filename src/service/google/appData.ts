import { setGoogleAPIToken } from '../../store/slices/session';
import { selectGoogleAPITokenState } from '../../store/slices/session/google';
import { store } from '../../store/state';
import { isInternetReachable } from '../../utils/network';
import { getGoogleAccessToken, googleInit, googleSignIn } from './signIn';

const url = 'https://www.googleapis.com/drive/v3';
const uploadUrl = 'https://www.googleapis.com/upload/drive/v3';
const boundaryString = 'foo_bar_baz';

interface MetaData {
  name: string;
  mimeType: string;
  parents?: string[];
}

export interface SecretAppData {
  device: string;
  encrypted: string;
}

const stateStore = store;

function queryParams() {
  return encodeURIComponent("name = 'enevti-secret.json'");
}

function createMultipartBody(body: any, isUpdate = false) {
  const metaData: MetaData = {
    name: 'enevti-secret.json',
    mimeType: 'application/json',
  };
  if (!isUpdate) {
    metaData.parents = ['appDataFolder'];
  }

  const multipartBody =
    `\r\n--${boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metaData)}\r\n` +
    `--${boundaryString}\r\nContent-Type: application/json\r\n\r\n` +
    `${JSON.stringify(body)}\r\n` +
    `--${boundaryString}--`;

  return multipartBody;
}

async function configurePostOptions(bodyLength: string, isUpdate = false) {
  let apiToken = selectGoogleAPITokenState(stateStore.getState());
  if (!apiToken) {
    googleInit();
    await googleSignIn();
    const newApiToken = await getGoogleAccessToken();
    stateStore.dispatch(setGoogleAPIToken(newApiToken));
    apiToken = newApiToken;
  }
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${apiToken}`);
  headers.append(
    'Content-Type',
    `multipart/related; boundary=${boundaryString}`,
  );
  headers.append('Content-Length', bodyLength);
  return {
    method: isUpdate ? 'PATCH' : 'POST',
    headers,
  };
}

async function configureGetOptions() {
  let apiToken = selectGoogleAPITokenState(stateStore.getState());
  if (!apiToken) {
    googleInit();
    await googleSignIn();
    const newApiToken = await getGoogleAccessToken();
    stateStore.dispatch(setGoogleAPIToken(newApiToken));
    apiToken = newApiToken;
  }
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${apiToken}`);
  return {
    method: 'GET',
    headers,
  };
}

function parseAndHandleErrors(response: any) {
  if (response.ok) {
    return response.json();
  }
  return response.json().then((error: any) => {
    throw new Error(JSON.stringify(error));
  });
}

async function getSecretId(): Promise<string> {
  const qParams = queryParams();
  const options = await configureGetOptions();
  return new Promise<string>((res, rej) => {
    fetch(`${url}/files?q=${qParams}&spaces=appDataFolder`, options)
      .then(parseAndHandleErrors)
      .then(body => {
        if (body && body.files && body.files.length > 0) {
          res(body.files[0].id);
        }
        res('');
      })
      .catch(err => rej(err));
  });
}

export async function getSecretAppData(): Promise<SecretAppData> {
  await isInternetReachable();
  const id = await getSecretId();
  if (!id) {
    return { device: '', encrypted: '' };
  }

  const options = await configureGetOptions();
  const downloadUrl = `${url}/files/${id}?alt=media`;
  return new Promise((res, rej) =>
    fetch(downloadUrl, options)
      .then(parseAndHandleErrors)
      .then(response => {
        res(response);
      })
      .catch(err => rej(err)),
  );
}

export async function setSecretAppData(content: SecretAppData): Promise<void> {
  await isInternetReachable();
  const body = createMultipartBody(content, false);
  const options = await configurePostOptions(body.length.toString(), false);
  return new Promise<void>((res, rej) => {
    fetch(`${uploadUrl}/files?uploadType=multipart`, {
      ...options,
      body,
    })
      .then(parseAndHandleErrors)
      .then(() => res())
      .catch(err => rej(err));
  });
}

export async function updateSecretAppData(
  content: SecretAppData,
): Promise<void> {
  await isInternetReachable();
  const id = await getSecretId();
  if (!id) {
    return;
  }

  const body = createMultipartBody(content, true);
  const options = await configurePostOptions(body.length.toString(), true);
  return new Promise<void>((res, rej) => {
    fetch(`${uploadUrl}/files/${id}?uploadType=multipart`, {
      ...options,
      body,
    })
      .then(parseAndHandleErrors)
      .then(() => res())
      .catch(err => rej(err));
  });
}
