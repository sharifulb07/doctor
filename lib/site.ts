const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

function normalizeSiteUrl(value?: string) {
  if (!value) return "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const SITE_URL = normalizeSiteUrl(configuredUrl);
export const SITE_NAME = "EasyDentalSolution";
