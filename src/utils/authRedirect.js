export const buildReturnPath = (from) => {
  if (!from?.pathname) return '/';
  return `${from.pathname}${from.search || ''}${from.hash || ''}`;
};

export const buildAuthRedirectState = (targetPath) => ({
  from: { pathname: targetPath },
});