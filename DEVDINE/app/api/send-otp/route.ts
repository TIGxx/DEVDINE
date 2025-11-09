import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with 5-minute expiration
    otpStore.set(email, {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    })

    // In production, send email via service like Resend, SendGrid, etc.
    // For now, we'll just log it and return it (for demo purposes)
    console.log(`[v0] OTP for ${email}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // Remove this in production - only for demo
      otp: otp,
    })
  } catch (error) {
    console.error("[v0] Error sending OTP:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const stored = otpStore.get(email)

    if (!stored) {
      return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 })
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(email)
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    if (stored.code !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid, remove it
    otpStore.delete(email)

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    })
  } catch (error) {
    console.error("[v0] Error verifying OTP:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
