import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const configureEnvironment = () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (process.env.PAYPAL_ENVIRONMENT === 'live') {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
  }
};

const client = () => {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

export default client;