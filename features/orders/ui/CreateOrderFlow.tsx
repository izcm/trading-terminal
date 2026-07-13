import { useState } from 'react'

import { NotConnectedError, WrongNetworkError, getChainConfig } from '@/lib/blockchain'
import { readERC721Contract, getBlockTimestamp, readERC20Contract } from '@/lib/blockchain/actions'
import { usePublicClient } from '@/lib/blockchain/hooks'
import { erc721Abi, erc20Abi } from '@/lib/blockchain'

import { OrderSide } from '@/protocol/eip712'
import type { Hex } from '@/domain/shared/eth'

import { toast } from '@/ui/molecules'
import { FormInput, OrderForm } from './OrderForm'

import { useCreateOrder } from '../hooks/use-create-order'
import { useWallet } from '@/features/wallet/hooks/use-wallet'

type Props = {
  collection: Hex
  tokenId: bigint
  side: OrderSide
  onOrderCreated?: (id: string) => void
  onOrderNavigate?: (id: string) => void // toast navigate to order
}

export function CreateOrderFlow({
  collection,
  tokenId,
  side,
  onOrderCreated,
  onOrderNavigate,
}: Props) {
  const { chainId, account } = useWallet()
  const client = usePublicClient({ chainId })

  const chain = client?.chain?.id ? getChainConfig(client.chain.id) : undefined

  const { create } = useCreateOrder(chainId, chain?.marketplace, account)

  const [approving, setApproving] = useState<boolean>(false)

  function rejectWith(description: string) {
    toast({ title: 'Order Creation Failed', description, variant: 'error' })
  }

  async function wrapAndSign(input: FormInput) {
    if (!account) throw new NotConnectedError('create order')
    if (!client || !chain) throw new WrongNetworkError('create order')

    let approvalsOk
    let reject

    try {
      if (side === OrderSide.ASK) {
        // reject if not owner of token (already semi-handled in marketplaceview but extra check here)
        reject = (await readERC721Contract(client, collection, 'ownerOf', [tokenId])) !== account

        if (reject) {
          rejectWith("You don't own this NFT")
          return
        }

        // for asks -> check marketplace has approved transfer auth
        approvalsOk =
          (await readERC721Contract(client, collection, 'isApprovedForAll', [
            account,
            chain.marketplace,
          ])) ||
          (await readERC721Contract(client, collection, 'getApproved', [tokenId])) ===
            chain.marketplace
      } else {
        // reject if account does not have sufficient weth balance
        reject = (await readERC20Contract(client, chain.weth, 'balanceOf', [account])) < input.price

        if (reject) {
          rejectWith('WETH balance lower than bid price.')
          return
        }

        // for bids -> check weth allowance + if user has enough funds
        approvalsOk =
          (await readERC20Contract(client, chain.weth, 'allowance', [
            account,
            chain.marketplace,
          ])) >= input.price
      }
    } catch {
      rejectWith('Failed to check necessary approvals.')
      return
    }

    // do approvals if not ok
    if (!approvalsOk) {
      setApproving(true)
      return
    }

    try {
      // block timestamp for dev, since no blocks are mined in background
      const now = await getBlockTimestamp(client)

      const id = await create(side, collection, tokenId, input.price, chain.weth, now, input.end)

      toast({
        title: 'Order Created',
        description: 'Your signed order is stored at dmrkt. The marketplace should update shortly.',
        variant: 'success',
        toastAction: onOrderNavigate
          ? { text: 'View order', fn: () => onOrderNavigate(id) }
          : undefined,
      })
      onOrderCreated?.(id)
    } catch (err) {
      console.error(err)

      rejectWith(
        err instanceof WrongNetworkError
          ? 'Are you connected to the correct network?'
          : err instanceof NotConnectedError
            ? 'Please connect your wallet.'
            : 'Something happened, order was not processed.'
      )
    }
  }

  return approving ? (
    <div>
      <h1>Approvals</h1>
    </div>
  ) : (
    <OrderForm tokenId={tokenId} onSubmit={wrapAndSign} />
  )
}
