import { useEffect, useState } from 'react'

import { formatEther, parseEther } from 'viem'
import { useBalance, useChainId } from 'wagmi'

import { useTheme } from '@/lib/hooks/use-theme'
import { useMarketplaceStatus } from '@/features/wallet/hooks/use-marketplace-status'

import { ArrowRow } from '@/ui/atoms'
import { ArrowList, GalleryItem, InlineAmountInput, toast } from '@/ui/molecules'
import { getChainConfig } from '@/lib/blockchain'
import { useWallet } from '@/features/wallet/hooks/use-wallet'

const THEMES = ['runtime', 'void']

/*
  displays:
  - Theme picker
  
  chain:
  - account's ETH / WETH balance 
  - marketplace allowance + update option
  - whether marketplace has isApprovedForAll for active collection
    + update option
*/

export function SettingsMenu() {
  const { isConnected, account } = useWallet()

  const { theme, applyTheme: setTheme } = useTheme()
  const chainId = useChainId()

  const chain = getChainConfig(chainId)

  const { data: ethBalance, refetch: refetchEth } = useBalance({ address: account })
  const hasEth = !!ethBalance && ethBalance.value > 0n

  const {
    approveWeth,
    wethBalance,
    isApproved,
    approveMarketplace,
    wethAllowance,
    deposit,
    errorMessage,
  } = useMarketplaceStatus()

  const [activeAction, setActiveAction] = useState<'deposit' | 'allowance' | null>(null)

  useEffect(() => {
    refetchEth()
  }, [wethBalance, refetchEth])

  useEffect(() => {
    if (errorMessage)
      toast({ title: 'Transaction failed', description: errorMessage, variant: 'error' })
  }, [errorMessage])

  let error

  if (!isConnected) {
    error = 'Connect wallet to see ETH / WETH balances and marketplace approvals.'
  }

  if (!chain) {
    error = 'The connected chain is not supported.'
  }

  const displayEth = (weth: bigint, decimals: number = 4) => {
    const eth = Number(formatEther(weth))
    return eth > Number.MAX_SAFE_INTEGER ? 'Unlimited' : eth.toFixed(decimals)
  }

  return (
    <div className="flex flex-col gap-2 p-1">
      {/* THEME PICKER */}
      <span className="text-sm text-subtle">Themes</span>
      <ArrowList
        items={THEMES}
        getId={t => t}
        selectedId={theme}
        onSelect={setTheme}
        direction="horizontal"
        className="flex gap-2 p-1 rounded-lg max-w-[400px]"
      >
        {({ item: t, isSelected, onSelect }) => (
          <ArrowRow
            key={t}
            isSelected={isSelected}
            onSelect={onSelect}
            dataId={t}
            className="rounded-lg p-1 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <GalleryItem image={`/themes/${t}.png`} title={t} />
          </ArrowRow>
        )}
      </ArrowList>

      {/* SEPARATOR */}
      <div className="h-[1px] bg-accent/40" />

      {/* CHAIN INFO */}
      <span className="text-sm text-subtle">Chain</span>
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-accent/10 max-w-[400px]">
        {error ? (
          <span className="text-sm text-subtle">{error}</span>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-subtle">ETH balance</span>
              <span className="text-sm">{hasEth ? displayEth(ethBalance.value) : '0 ETH'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-subtle">WETH balance</span>
              <div className="flex items-center gap-2">
                {activeAction !== 'deposit' && (
                  <span className="text-sm">
                    {wethBalance !== 0n && wethBalance ? displayEth(wethBalance) : '—'}
                  </span>
                )}
                <InlineAmountInput
                  open={activeAction === 'deposit'}
                  onOpen={() => setActiveAction('deposit')}
                  onClose={() => setActiveAction(null)}
                  onSubmit={amount => deposit(parseEther(amount))}
                  label="Deposit"
                  disabled={!hasEth}
                  textPlaceholder="0.0"
                />
              </div>
            </div>

            <div className="h-[1px] bg-accent/40" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-subtle">Marketplace allowance</span>
              <div className="flex items-center gap-2">
                {activeAction !== 'allowance' && (
                  <span className="text-sm">
                    {wethAllowance ? displayEth(wethAllowance) + ' WETH' : '—'}
                  </span>
                )}
                <InlineAmountInput
                  open={activeAction === 'allowance'}
                  onOpen={() => setActiveAction('allowance')}
                  onClose={() => setActiveAction(null)}
                  onSubmit={amount => approveWeth(parseEther(amount))}
                  label="Update"
                  disabled={!hasEth}
                  textPlaceholder="0.0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-subtle">Collection approval</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{isApproved ? 'Approved' : 'Not approved'}</span>
                <button
                  onClick={() => approveMarketplace(!isApproved)}
                  disabled={!hasEth}
                  className="cursor-pointer text-sm text-subtle underline underline-offset-2 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
                >
                  Update
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
