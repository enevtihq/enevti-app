import { EncryptedData } from 'enevti-app/types/utils/cryptography';
import { appFetch, isInternetReachable } from 'enevti-app/utils/app/network';
import { getGoogleAccessToken } from './signIn';

const url = 'https://www.googleapis.com/drive/v3';
const uploadUrl = 'https://www.googleapis.com/upload/drive/v3';
const boundaryString = 'foo_bar_baz';

interface MetaData {
  name: string;
  mimeType: string;
  parents?: string[];
}

export interface SecretAppData {
  device: EncryptedData;
  encrypted: EncryptedData;
}

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
  const apiToken = await getGoogleAccessToken();
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${apiToken}`);
  headers.append('Content-Type', `multipart/related; boundary=${boundaryString}`);
  headers.append('Content-Length', bodyLength);
  return {
    method: isUpdate ? 'PATCH' : 'POST',
    headers,
  };
}

async function configureGetOptions() {
  const apiToken = await getGoogleAccessToken();
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
    appFetch(`${url}/files?q=${qParams}&spaces=appDataFolder`, options)
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

export function isExistingAccount(data: SecretAppData): boolean {
  return !!data.device.data && !!data.encrypted.data;
}

export async function getSecretAppData(): Promise<SecretAppData> {
  await isInternetReachable();
  const id = await getSecretId();
  if (!id) {
    return {
      device: {
        status: '',
        data: '',
        version: 0,
      },
      encrypted: {
        status: '',
        data: '',
        version: 0,
      },
    };
  }

  const options = await configureGetOptions();
  const downloadUrl = `${url}/files/${id}?alt=media`;
  return new Promise((res, rej) =>
    appFetch(downloadUrl, options)
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
    appFetch(`${uploadUrl}/files?uploadType=multipart`, {
      ...options,
      body,
    })
      .then(parseAndHandleErrors)
      .then(() => res())
      .catch(err => rej(err));
  });
}

export async function updateSecretAppData(content: SecretAppData): Promise<void> {
  await isInternetReachable();
  const id = await getSecretId();
  if (!id) {
    return;
  }

  const body = createMultipartBody(content, true);
  const options = await configurePostOptions(body.length.toString(), true);
  return new Promise<void>((res, rej) => {
    appFetch(`${uploadUrl}/files/${id}?uploadType=multipart`, {
      ...options,
      body,
    })
      .then(parseAndHandleErrors)
      .then(() => res())
      .catch(err => rej(err));
  });
}
