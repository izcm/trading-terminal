import { erc20Abi, erc721Abi } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import { useActionPair } from '@/lib/blockchain/hooks/'
import { getChainConfig } from '@/lib/blockchain'

import { useCollection } from '../../CollectionContext'

const wethAbi = [
  ...erc20Abi,
  {
    type: 'function',
    name: 'deposit',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
] as const

// export function useMarketplaceStatus({ weth, marketplace, collection }: Props) {
export function useMarketplaceStatus() {
  const account = useAccount()
  const { collection } = useCollection()

  const chainId = useChainId()
  const chain = getChainConfig(chainId)

  // WETH BALANCE & DEPOSIT
  const { data: wethBalance, refetch: fetchWeth, write: writeDeposit } = useActionPair({
    readAction: {
      abi: wethAbi,
      functionName: 'balanceOf',
      address: account.address,
      args: [account.address!],
    },
    writeAction: {
      abi: wethAbi,
      functionName: 'deposit',
      address: chain?.weth,
    },
  })

  function deposit(amount: bigint) {
    return writeDeposit([], amount)
  }

  // WETH ALLOWANCE & APPROVE
  const { data: wethAllowance, write: writeApproveWeth } = useActionPair({
    readAction: {
      abi: erc20Abi,
      functionName: 'allowance',
      address: chain?.weth,
      args: [account.address!, chain?.marketplace!],
    },
    writeAction: {
      abi: erc20Abi,
      functionName: 'approve',
      address: chain?.weth,
    },
  })

  function approveWeth(amount: bigint) {
    return writeApproveWeth([chain?.marketplace!, amount])
  }

  // MARKETPLACE APPROVAL & APPROVE
  const { data: isApproved, write: writeApproveMarketplace } = useActionPair({
    readAction: {
      abi: erc721Abi,
      functionName: 'isApprovedForAll',
      address: collection?.address,
      args: [account.address!, chain?.marketplace!],
    },
    writeAction: {
      abi: erc721Abi,
      functionName: 'setApprovalForAll',
      address: collection?.address,
    },
  })

  function approveMarketplace(approved: boolean) {
    return writeApproveMarketplace([chain?.marketplace!, approved])
  }

  return { approveWeth, wethBalance, wethAllowance, isApproved, approveMarketplace, deposit }
}
