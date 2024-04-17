'use server'

import { z } from 'zod'

export default async function newsletterSignup(prevState: any, formData: FormData): Promise<{ data?: string, error?: string, invalid?: any[] }> {

  try {

    const email = formData.get('email')

    try {
      z.string().email({ message: "Ogiltig e-post adress" }).parse(email as string)
    } catch (e) {
      throw new Error("Ogiltig e-post adress")
    }

    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const DATACENTER = process.env.MAILCHIMP_API_SERVER;

    const data = { email_address: email, status: 'subscribed' };

    const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`, {
      body: JSON.stringify(data),
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Authorization': `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const { title, status, detail } = await response.json()

    if (status >= 400) {
      const exists = title?.toLowerCase().includes('exists') ?? false
      throw new Error(exists ? 'Du är redan anmäld till nyhetsbrevet' : 'Det uppstod ett fel, försök igen senare.')
    }

    return { data: 'ok' }

  } catch (e) {
    console.log(e)
    return { error: e.message }
  }
}

