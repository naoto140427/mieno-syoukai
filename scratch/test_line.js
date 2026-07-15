require('dotenv').config({ path: '.env.local' });

const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const groupId = process.env.LINE_GROUP_ID;
const message = "【MIENO COMMAND CENTER】 テストメッセージです。LINE通知機能（グループ配信）の稼働テストを実行中。";

async function testLine() {
  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        to: groupId,
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Failed:', await response.text());
    } else {
      console.log('Success push to group!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testLine();
