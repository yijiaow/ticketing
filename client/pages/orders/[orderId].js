import Router from 'next/router';
import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

const Order = ({ order, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => Router.push('/orders'),
  });

  const onToken = (token) => {
    doRequest({ token: token.id });
  };

  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      <StripeCheckout
        token={onToken}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        amount={order.ticket.price * 100}
        currency="USD"
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

Order.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders/${context.query.orderId}`);
  return { order: data };
};

export default Order;
