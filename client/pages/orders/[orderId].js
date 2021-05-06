import Router from 'next/router';
import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

const Order = ({ order, currentUser }) => {
  const [countdown, setCountdown] = useState();
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      setCountdown(Math.round(new Date(order.expiresAt) - new Date()));
    };
    findTimeLeft();
    const intervalId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onToken = (token) => {
    doRequest({ token: token.id });
  };

  const convertFromMs = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    const hStr = h > 0 ? `${h} ${h === 1 ? 'hour' : 'hours'}` : '';
    const mStr = m > 0 ? `${m} ${m === 1 ? 'minute' : 'minutes'}` : '';
    const sStr = s > 0 ? `${s} ${s === 1 ? 'second' : 'seconds'}` : '';

    return `${hStr} ${mStr} ${sStr}`;
  };

  if (countdown < 0) {
    return <h5>Order has expired</h5>;
  }
  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      <h5>Time left to pay: {convertFromMs(countdown)}</h5>
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
