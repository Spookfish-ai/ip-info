import { NowRequest, NowResponse } from '@now/node'
import fetch from 'isomorphic-unfetch'

export default async (req: NowRequest, res: NowResponse) => {
  try {
    let ip = req.headers['x-forwarded-for']
    if (process.env.NODE_ENV === 'development') {
      await fetch('https://api6.ipify.org').then(async (res) => (ip = await res.text()))
    }
    if (!ip) throw new Error('No valid ip found')
    const response = await fetch(`https://freegeoip.app/json/${ip}`, {
      method: 'get',
      mode: 'no-cors',
      headers: {
        accept: 'application/json',
      },
    })
    if (!response.ok) throw new Error('API error')
    const data = await response.json()
    return res.json(data)
  } catch (error) {
    return res.json({ message: error.message })
  }
}
