export function apiKey() {
  return {
  };
}

export function uriSearch() {
  let host = '';
  const productionHost = {
    youtube: 'https://www.googleapis.com/youtube/v3/search',
    giphy: 'http://api.giphy.com/v1/gifs/search',
  };

  switch (process.env.NODE_ENV) {
    case 'e2eTest':
      host = productionHost;
      break;
    case 'development':
    case 'production':
      host = productionHost;
      break;
    default:
      host = productionHost;
  }

  return host;
}

export function errorMessage() {
  return;
}
