// todo: indexer will move from storing rsv => storing raw signature asap
import { parseSignature } from 'viem'
import type { OrderCore } from '@/protocol/eip712'
import type { Hex } from '@/domain/shared/eth'

export const baseUrl = process.env.NEXT_PUBLIC_INDEXER_ENDPOINT_URL

export async function postDmrktOrder(chainId: number, order: OrderCore, signature: Hex) {
  const url = `${baseUrl}/api/orders`

  // todo: remember to make signature hex (no need to store in parsed fmt)
  const parsed = parseSignature(signature)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-chain-id': chainId.toString(),
      },
      body: JSON.stringify({
        ...order,
        signature: {
          r: parsed.r,
          s: parsed.s,
          v: parsed.v?.toString(),
        },
      }),
    })

    if (!res.ok) {
      return { ok: false, error: await res.text() }
    }

    const data = await res.json()

    return {
      ok: true,
      data,
    }
  } catch (err) {
    return { ok: false, error: `error getting items: ${err}` }
  }
}
