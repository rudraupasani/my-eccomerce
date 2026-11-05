import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummyKeySecret'

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({ success: true, message: 'Payment verified successfully' })
    } else {
      return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Razorpay verification error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}
