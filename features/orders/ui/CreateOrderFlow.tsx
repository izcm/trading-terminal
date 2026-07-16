import { useEffect, useRef, useState } from 'react'

import { parseEther, Hex } from 'viem'
import { useAccount } from 'wagmi'

import {
  NotConnectedError,
  WrongNetworkError,
  getChainConfig,
  erc721Abi,
  erc20Abi,
  WriteAction,
} from '@/lib/blockchain'
import { readERC721Contract, getBlockTimestamp, readERC20Contract } from '@/lib/blockchain/actions'
import { usePublicClient, useSimpleWrite } from '@/lib/blockchain/hooks'

import { OrderSide } from '@/protocol/eip712'

import { toast } from '@/ui/molecules'
import { FormInput, OrderForm } from './OrderForm'

import { useCreateOrder } from '../hooks/use-create-order'

type Props = {
  collection: Hex
  tokenId: bigint
  side: OrderSide
  onOrderCreated?: (id: string) => void
  onOrderNavigate?: (id: string) => void // toast navigate to order
}

type PendingAction = { label: string; action: WriteAction }

export function CreateOrderFlow({
  collection,
  tokenId,
  side,
  onOrderCreated,
  onOrderNavigate,
}: Props) {
  const { chainId, address } = useAccount()
  const client = usePublicClient({ chainId })

  const chain = client?.chain?.id ? getChainConfig(client.chain.id) : undefined

  const { create } = useCreateOrder(chainId, chain?.marketplace, address)
  const { simpleWrite } = useSimpleWrite()

  const approvalsRef = useRef<HTMLButtonElement>(null)

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [pendingInput, setPendingInput] = useState<FormInput | null>(null)
  const [approvalConfirmed, setApprovalConfirmed] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  function rejectWith(description: string) {
    toast({ title: 'Order Creation Failed', description, variant: 'error' })
  }

  useEffect(() => {
    if (!pendingAction) return
    approvalsRef.current?.focus()
  }, [pendingAction, approvalConfirmed])

  if (!address) return <div>Please connect your wallet.</div>
  if (!client || !chain) return <div>Are you connected to the correct network?</div>

  async function signAndCreate(input: FormInput) {
    if (!client || !chain) return

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

  async function wrapAndSign(input: FormInput) {
    if (!client || !chain || !address) return

    let approvalsOk
    let reject

    try {
      if (side === OrderSide.ASK) {
        // reject if not owner of token (already semi-handled in marketplaceview but extra check here)
        reject = (await readERC721Contract(client, collection, 'ownerOf', [tokenId])) !== address

        if (reject) {
          rejectWith("You don't own this NFT")
          return
        }

        // for asks -> check marketplace has approved transfer auth
        approvalsOk =
          (await readERC721Contract(client, collection, 'isApprovedForAll', [
            address,
            chain.marketplace,
          ])) ||
          (await readERC721Contract(client, collection, 'getApproved', [tokenId])) ===
            chain.marketplace
      } else {
        // reject if address does not have sufficient weth balance
        reject =
          (await readERC20Contract(client, chain.weth, 'balanceOf', [address])) <
          parseEther(input.price)

        if (reject) {
          rejectWith('WETH balance lower than bid price.')
          return
        }

        // for bids -> check weth allowance + if user has enough funds
        approvalsOk =
          (await readERC20Contract(client, chain.weth, 'allowance', [
            address,
            chain.marketplace,
          ])) >= parseEther(input.price)
      }
    } catch {
      rejectWith('Failed to check necessary approvals.')
      return
    }

    if (!approvalsOk) {
      const action: WriteAction =
        side === OrderSide.ASK
          ? {
              abi: erc721Abi,
              address: collection,
              functionName: 'setApprovalForAll',
              args: [chain.marketplace, true],
            }
          : {
              abi: erc20Abi,
              address: chain.weth,
              functionName: 'approve',
              args: [chain.marketplace, parseEther(input.price)],
            }

      setPendingAction({
        label:
          side === OrderSide.ASK ? 'Approve NFT for marketplace' : 'Approve WETH for marketplace',
        action,
      })
      setPendingInput(input)
      setApprovalConfirmed(false)
      return
    }

    await signAndCreate(input)
  }

  function handleApprove() {
    if (!pendingAction) return

    setIsApproving(true)
    simpleWrite({
      ...pendingAction.action,
      onSuccess: () => {
        setIsApproving(false)
        setApprovalConfirmed(true)
      },
      onError: err => {
        setIsApproving(false)
        rejectWith(`Approval failed: ${err.message}`)
      },
    })
  }

  async function handleSignAfterApproval() {
    if (!pendingInput) return

    const input = pendingInput
    setPendingAction(null)
    setPendingInput(null)
    setApprovalConfirmed(false)

    await signAndCreate(input)
  }

  return pendingAction ? (
    <div className="flex flex-col gap-4 p-4">
      <h1>Approve to continue</h1>
      <button
        ref={!approvalConfirmed ? approvalsRef : undefined}
        className="btn"
        disabled={isApproving || approvalConfirmed}
        onClick={handleApprove}
      >
        {pendingAction.label}
      </button>
      <button
        ref={approvalConfirmed ? approvalsRef : undefined}
        className="btn"
        disabled={!approvalConfirmed}
        onClick={handleSignAfterApproval}
      >
        Sign Order
      </button>
    </div>
  ) : (
    <OrderForm tokenId={tokenId} onSubmit={wrapAndSign} />
  )
}
