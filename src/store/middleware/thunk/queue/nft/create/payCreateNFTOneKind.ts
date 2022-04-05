import { COIN_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
} from 'enevti-app/store/slices/payment';
import { CreateNFTOneKind } from 'enevti-app/types/store/CreateNFTQueue';
import { AppThunk } from 'enevti-app/store/state';
import { calculateGasFee } from 'enevti-app/service/enevti/transaction';
import { CreateNFTOneKindTransaction } from 'enevti-app/types/service/enevti/transaction';
import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';
import i18n from 'enevti-app/translations/i18n';

export const payCreateNFTOneKind =
  (payload: CreateNFTOneKind): AppThunk =>
  async dispatch => {
    dispatch({ type: 'onekind/payCreateNFTOneKind' });
    dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
    const data = makeDummyIPFS();
    const cover = payload.state.coverUri ? makeDummyIPFS() : '';
    const content = payload.state.utility === 'content' ? makeDummyIPFS() : '';
    const contentMime =
      payload.state.utility === 'content' ? payload.state.contentType : '';
    const contentSize =
      payload.state.utility === 'content' ? payload.state.contentSize : -1;
    let until: number;
    if (payload.state.recurring !== 'anytime') {
      const now = new Date();
      const dateFrom = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        payload.state.fromHour,
        payload.state.fromMinute,
      );
      const dateUntil = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        payload.state.untilHour,
        payload.state.untilMinute,
      );
      until = dateUntil + (dateUntil < dateFrom ? 86400000 : 0) - dateFrom;
    } else {
      until = 0;
    }
    const transactionPayload: CreateNFTOneKindTransaction = {
      name: payload.state.name,
      description: payload.state.description,
      symbol: payload.state.symbol,
      cover: cover,
      data: data,
      dataMime: payload.data.mime,
      dataSize: payload.data.size,
      utility: payload.state.utility,
      content: content,
      contentMime: contentMime,
      contentSize: contentSize,
      recurring: payload.state.recurring,
      time: {
        day: payload.state.timeDay,
        date: payload.state.timeDate,
        month: payload.state.timeMonth,
        year: payload.state.timeYear,
      },
      from: {
        hour: payload.state.fromHour,
        minute: payload.state.fromMinute,
      },
      until: until,
      redeemLimit: parseInt(payload.state.redeemLimit, 10),
      royalty: {
        creator: parseInt(
          payload.state.royaltyCreator ? payload.state.royaltyCreator : '0',
          10,
        ),
        staker: parseInt(
          payload.state.royaltyStaker ? payload.state.royaltyStaker : '0',
          10,
        ),
      },
      price: {
        amount: BigInt(payload.state.priceAmount),
        currency: payload.state.priceCurrency,
      },
      quantity: parseInt(payload.state.quantity, 10),
      mintingExpire: parseInt(payload.state.mintingExpire, 10),
    };
    const gasFee = await calculateGasFee(transactionPayload);
    dispatch(setPaymentFee({ gas: gasFee, platform: BigInt(0) }));
    dispatch(
      setPaymentAction({
        type: 'createNFTOneKind',
        icon: iconMap.nftOneKind,
        name: i18n.t('payment:payCreateNFTOneKindName'),
        description: i18n.t('payment:payCreateNFTOneKindDescription'),
        amount: BigInt(0),
        currency: COIN_NAME,
        payload: JSON.stringify(payload),
      }),
    );
    dispatch(showPayment());
  };
