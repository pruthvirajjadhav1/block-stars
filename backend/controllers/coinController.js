const axios = require('axios');
const apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
const clients = [];

const getCoinPrice = async (req, res) => {
    try {
        // Fetch coin price data from CoinGecko
        const { symbol } = req.query;
        const response = await axios.get(apiUrl, {
          params: { ids: 'bitcoin', vs_currencies: 'usd' },
        });
    
        const price = response.data.bitcoin.usd;
    
        // Send the latest price to all connected clients
        clients.forEach((client) => {
          client.res.write(`data: ${JSON.stringify({ price })}\n\n`);
        });
    
        res.json({ price });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

const sse = async (req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push({ req, res });

  // Handle disconnection
  req.on('close', () => {
    const index = clients.findIndex((client) => client.res === res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

}

module.exports = { getCoinPrice,sse };
