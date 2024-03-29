import { APIResponse } from 'enevti-types/service/api';
import { urlGetAvatarUrl } from 'enevti-app/utils/constant/URLCreator';
import { apiFetch } from 'enevti-app/utils/app/network';

async function fetchAvatarUrl(address: string, signal?: AbortController['signal']): Promise<APIResponse<string>> {
  return await apiFetch<string>(urlGetAvatarUrl(address), signal);
}

export async function getAvatarUrl(address: string, signal?: AbortController['signal']) {
  return await fetchAvatarUrl(address, signal);
}
