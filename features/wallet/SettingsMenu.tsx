import { useState } from 'react'

import { parseEther } from 'viem'
import { useChainId } from 'wagmi'

import { useTheme } from '@/lib/hooks/use-theme'
import { useMarketplaceStatus } from '@/features/wallet/hooks/use-marketplace-status'

import { ArrowRow } from '@/ui/atoms'
import { ArrowList, GalleryItem } from '@/ui/molecules'
import { getChainConfig } from '@/lib/blockchain'
import { useWallet } from '@/features/wallet/hooks/use-wallet'
import { useCollection } from '@/features/CollectionContext'

const THEMES = ['runtime', 'void']

type AmountActionProps = {
  label: string
  open: boolean
  onOpen: () => void
  onClose: () => void
  onSubmit: (amount: string) => void
}

function AmountAction({ label, open, onOpen, onClose, onSubmit }: AmountActionProps) {
  const [amount, setAmount] = useState('')

  function confirm() {
    if (!amount) {
      onClose()
      return
    }

    onSubmit(amount)
    setAmount('')
    onClose()
  }

  return (
    <div className="flex items-center gap-2">
      {open && (
        <input
          type="text"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') confirm()
          }}
          placeholder="0.0"
          autoFocus
          className="w-20 bg-transparent text-sm text-right outline-none border-b border-accent/40"
        />
      )}
      <button
        onClick={open ? confirm : onOpen}
        className="cursor-pointer text-sm text-subtle underline underline-offset-2 hover:text-white"
      >
        {open ? 'Confirm' : label}
      </button>
    </div>
  )
}

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
  const { isConnected } = useWallet()

  const { theme, applyTheme: setTheme } = useTheme()
  const chainId = useChainId()

  const chain = getChainConfig(chainId)

  const { approveWeth, wethBalance, isApproved, approveMarketplace, deposit } =
    useMarketplaceStatus()

  const [activeAction, setActiveAction] = useState<'deposit' | 'allowance' | null>(null)

  let error

  if (!isConnected) {
    error = 'Connect wallet to see your ETH / WETH balances and marketplace approvals.'
  }

  if (!chain) {
    error = 'The connected chain is not supported.'
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
              <span className="text-sm">—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-subtle">WETH balance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{wethBalance?.toString() ?? '—'}</span>
                <AmountAction
                  open={activeAction === 'deposit'}
                  onOpen={() => setActiveAction('deposit')}
                  onClose={() => setActiveAction(null)}
                  onSubmit={amount => deposit(parseEther(amount))}
                  label="Deposit"
                />
              </div>
            </div>

            <div className="h-[1px] bg-accent/40" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-subtle">Marketplace allowance</span>
              <AmountAction
                open={activeAction === 'allowance'}
                onOpen={() => setActiveAction('allowance')}
                onClose={() => setActiveAction(null)}
                onSubmit={amount => approveWeth(parseEther(amount))}
                label="Update"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-subtle">Collection approval</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{isApproved ? 'Approved' : 'Not approved'}</span>
                <button
                  onClick={() => approveMarketplace(!isApproved)}
                  className="cursor-pointer text-sm text-subtle underline underline-offset-2 hover:text-white"
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
