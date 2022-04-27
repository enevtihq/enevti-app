import { urlWSCore } from 'enevti-app/utils/constant/URLCreator';
import * as Lisk from '@liskhq/lisk-client';

export default class ChainClient {
  static client: Lisk.apiClient.APIClient | undefined = undefined;

  static async getInstance() {
    if (ChainClient.client === undefined) {
      ChainClient.client = await Lisk.apiClient.createWSClient(urlWSCore());
    }

    return this.client;
  }
}
