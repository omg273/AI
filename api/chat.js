const fetch = require('node-fetch');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, conversationId } = req.body;

    const COZE_API_URL = 'https://api.coze.cn/open_api/v2/chat';
    const API_KEY = process.env.API_KEY;
    const BOT_ID = process.env.BOT_ID;

    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user: 'user-' + Date.now(),
        query: message,
        conversation_id: conversationId || '',
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      success: true,
      message: data.messages?.[0]?.content || '抱歉，我暂时无法回复',
      conversationId: data.conversation_id
    });

  } catch (error) {
    console.error('API 调用失败:', error);
    res.json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
}