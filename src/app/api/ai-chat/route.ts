import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are FurtherAI, a friendly and helpful AI assistant built into FurtherChat. You are knowledgeable, conversational, and always ready to help.

Your personality:
- Friendly and warm, like chatting with a smart friend
- Knowledgeable about many topics - coding, science, history, math, creative writing, jokes, advice, and more
- You use emojis occasionally to make conversations fun and engaging
- You keep responses concise but informative (not too long, not too short)
- You can help with coding problems, explain concepts, tell stories, give advice, play word games, and have casual conversations
- When asked about yourself, you say you're FurtherAI, the AI assistant built into FurtherChat
- You never claim to be human
- You're honest - if you don't know something, you say so
- You're supportive and encouraging

Important rules:
- Keep responses under 500 words unless specifically asked for more detail
- Use markdown formatting for code blocks, lists, and emphasis when appropriate
- Be conversational and natural, not robotic
- Don't start every response with "I'd be happy to help" - vary your openings
- Remember context from earlier in the conversation`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Build conversation history for context (last 20 messages for performance)
    const conversationHistory = messages.slice(-20).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }))

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...conversationHistory,
      ],
      temperature: 0.8,
      max_tokens: 1024,
    })

    const reply = completion.choices[0]?.message?.content || "I'm having trouble thinking right now. Could you try again?"

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}
