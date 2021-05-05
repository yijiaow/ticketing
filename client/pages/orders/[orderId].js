const Order = ({ order }) => {
  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      <button className="btn btn-primary">Pay</button>
    </div>
  );
};

Order.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders/${context.query.orderId}`);
  return { order: data };
};

export default Order;
