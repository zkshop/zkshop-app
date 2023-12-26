import { testPlatformClient } from '@3shop/domains';
import { platforms } from '@3shop/domains/nft/NftPlatform';
import { NftApiParams } from '@3shop/domains/nft/Xrp/Bithomp.types';
import axios from 'axios';

export function NftReaderClient(): testPlatformClient.NftClient<platforms.XRP> {
  return {
    getWalletNfts: async (walletAddress, identifiers) => {
      const params: NftApiParams = {
        owner: walletAddress,
        list: 'nfts',
      };
      const nfts = await axios
        .get(`https://bithomp.com/api/v2/nfts`, {
          params,
          headers: {
            'x-bithomp-token': '131c5def-d154-4a4c-9dea-59afc1eb0a7d',
          },
        })
        .then(({ data }) => {
          return data.nfts;
        });
        return nfts;
      // return nfts.filter(nft => {
      //   return Object.keys(identifiers).every(key => nft.hasOwnProperty(key));
      // });
    },
  };
}
