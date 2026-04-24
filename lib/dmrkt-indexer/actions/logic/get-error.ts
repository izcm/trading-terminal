export async function getResponseError(res: Response) {
  let error: string

  try {
    const json = await res.json()
    error = json.message ?? JSON.stringify(json)
  } catch {
    error = await res.text()
  }

  return error
}
