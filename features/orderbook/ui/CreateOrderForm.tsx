'use client'

import { useState } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'

import { parseEther } from 'viem'

// local
import { domain, fields } from '@/features/orderbook/eip712'
import { createOrder } from '../actions/create-order'
import { FormSelect } from '@/components/molecules/FormSelect'

import { DURATIONS } from '../../../data/constants/durations'

const collectionAddr = '0x0000000000000000000000000000000000000000' as `0x${string}`
const tokenAddr = '0x0000000000000000000000000000000000000000' as `0x${string}`

export const CreateOrderForm = () => {
  const { address: account, isConnected } = useAccount()
  const { signTypedDataAsync } = useSignTypedData()

  const [form, setForm] = useState({
    side: 0,
    price: '',
    actor: account,
    isCollectionBid: true,
    end: 0,
  })

  const handleSumbitOrder = async () => {
    const now = Math.floor(Date.now() / 1000)

    const order = {
      side: form.side,
      actor: account,
      isCollectionBid: form.isCollectionBid,
      collection: collectionAddr,
      tokenId: BigInt(123), // TODO select token
      price: parseEther(form.price),
      currency: tokenAddr,
      start: BigInt(now),
      end: BigInt(now + form.end),
      nonce: BigInt(77), // TODO generate
    }

    const types = {
      Order: fields,
    }

    try {
      const sig = await signTypedDataAsync({
        domain,
        types,
        primaryType: 'Order',
        message: order,
      })

      const res = await createOrder({ ...order, signature: sig })
    } catch (err) {
      console.error('createOrder error:', err)
      throw err // rethrow so you see it in client console too
    }
  }

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const getDotClass = (isSide: number) =>
    `h-2 w-2 rounded-full ${form.side === isSide ? 'bg-accent' : 'border border-default'}`

  const handleCollectionBidChange = (value: string) => {
    handleChange('isCollectionBid', value === 'any')
  }

  const handleEndChange = (value: string) => {
    handleChange('end', DURATIONS[value as keyof typeof DURATIONS])
  }

  return (
    <main className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div className="text-center text-lg font-medium">Create Order</div>

      {/* Form Card */}
      <div className="card p-8 flex flex-col gap-8">
        {/* Order Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Order Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleChange('side', 0)}
              className="btn py-1 flex items-center gap-2"
            >
              <span className={getDotClass(0)} />
              SELL
            </button>

            <button
              onClick={() => handleChange('side', 1)}
              className="btn py-1 flex items-center gap-2"
            >
              <span className={getDotClass(1)} />
              BUY
            </button>
          </div>
        </div>

        {/* Token */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Token</label>

          {/* SELL — specific token */}
          <FormSelect
            options={[
              { label: '#42', value: '42' },
              { label: '#1337', value: '1337' },
            ]}
            onChange={value => handleChange('tokenId', value)}
            defaultValue="42"
          />

          {/* BUY — collection bid */}
          <FormSelect
            options={[
              { label: 'Any Token', value: 'any' },
              { label: 'Specific Token #…', value: 'specific' },
            ]}
            onChange={handleCollectionBidChange}
            defaultValue="any"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Price (ETH)</label>
          <input
            onChange={e => {
              const price = e.target.value
              handleChange('price', price)
            }}
            type="number"
            className="border border-default rounded px-3 py-2"
            placeholder="0.42"
          />
        </div>

        {/* Valid Until */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Valid Until</label>
          <FormSelect
            options={[
              { label: '7 days', value: '7d' },
              { label: '1 day', value: '1d' },
              { label: '30 minutes', value: '30m' },
            ]}
            onChange={handleEndChange}
            defaultValue="7d"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-default pt-4" />

        {/* Review Block */}
        <div className="flex flex-col gap-1 text-sm">
          <div className="font-semibold">Review</div>
          <div>SELL • #42</div>
          <div>Ξ0.42</div>
          <div>7 days left</div>
        </div>

        {/* Sign Button */}
        <button onClick={handleSumbitOrder} className="btn btn-primary mt-4 rounded px-4 py-2">
          SIGN ORDER
        </button>
      </div>
    </main>
  )
}
