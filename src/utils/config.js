export function uriSearch() {
  let host = '';

  switch (process.env.NODE_ENV) {
    case 'e2eTest':
      host = {
        youtube: 'https://www.googleapis.com/youtube/v3/search'
      };
      break;
    case 'development':
      host = {
        youtube: 'https://www.googleapis.com/youtube/v3/search'
      };
      break;
    case 'staging':
      host = {
        youtube: 'https://www.googleapis.com/youtube/v3/search'
      };
      break;
    case 'production':
      host = {
        youtube: 'https://www.googleapis.com/youtube/v3/search'
      };
      break;
    default:
      host = {
        youtube: 'https://www.googleapis.com/youtube/v3/search'
      };
  }

  return host;
}

export function errorMessage() {
  return;
}
