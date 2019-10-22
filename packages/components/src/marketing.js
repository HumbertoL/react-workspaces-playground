export const getMarketingMetrics = () => {
  const result = {};
  const parsedCookies = {};

  // Converts from string to object
  document.cookie.split(';').forEach((cookie) => {
    const match = new RegExp(/(\w+)=(.+)/).exec(cookie);
    if (match) {
      const key = match[1];
      const value = match[2];
      parsedCookies[key] = value;
    }
  });

  if (parsedCookies.AccountExtAttributes) {
    const json = JSON.parse(parsedCookies.AccountExtAttributes);
    result.AdTracking = json;
  }

  if (parsedCookies.HTTPReferer) {
    const { HTTPReferer } = parsedCookies;
    // Truncates value to fit database field
    result.HTTPReferer = HTTPReferer.length > 255
      ? HTTPReferer.substr(0, 255)
      : HTTPReferer;
  }

  return result;
};
