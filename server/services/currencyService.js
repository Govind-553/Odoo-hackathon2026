import axios from 'axios';
import NodeCache from 'node-cache';

// Cache for 1 hour (3600 seconds)
const rateCache = new NodeCache({ stdTTL: 3600 });

const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest';

export const getExchangeRate = async (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return 1;

  const cacheKey = `rate_${fromCurrency}_${toCurrency}`;
  const cachedRate = rateCache.get(cacheKey);

  if (cachedRate) {
    return cachedRate;
  }

  try {
    const response = await axios.get(`${EXCHANGE_RATE_API_URL}/${fromCurrency}`);
    const rates = response.data.rates;
    const rate = rates[toCurrency];

    if (!rate) {
      throw new Error(`Rate not found for ${toCurrency}`);
    }

    // Cache the rate
    rateCache.set(cacheKey, rate);
    return rate;
  } catch (error) {
    console.error('ExchangeRate API error:', error.message);
    throw new Error('Failed to fetch exchange rates');
  }
};

export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  return {
    convertedAmount: Number((amount * rate).toFixed(2)),
    rate,
  };
};

export default {
  getExchangeRate,
  convertCurrency,
};
