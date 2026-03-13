const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 扣子 API 配置
const COZE_API_URL = 'https://api.coze.cn/open_api/v2/chat';
const API_KEY = process.env.API_KEY; // 从环境变量读取
const BOT_ID = process.env.BOT_ID;   // 从环境变量读取

// 对话接口
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user: 'user-' + Date.now(), // 简单的用户ID生成
        query: message,
        conversation_id: conversationId || '',
        stream: false // 非流式模式，新手友好
      })
    });

    const data = await response.json();

    // 返回扣子的回复
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
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
