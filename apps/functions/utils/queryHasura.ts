import axios from 'axios';

export async function queryHasura(query: { query: string }) {
  const res = await axios(process.env.HASURA_API_URL || '', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',

      'x-hasura-admin-secret': process.env.HASURA_API_KEY || '',
    },
    data: JSON.stringify(query),
  });

  return res.data;
}
