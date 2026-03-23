function useNFTPage(filters: Record<string, string[]>) {
  const [items, setItems] = useState<NFT[]>([])
  const [cursor, setCursor] = useState<string | null>(null)

  const fetchPage = useCallback(async () => {
    const res = await getDmrktNFTs({ ...filters, cursor })

    if (!res.ok) return

    setItems(prev => [...prev, ...res.data.items])
    setCursor(res.data.cursor)
  }, [filters, cursor])

  return { items, fetchPage, cursor }
}
