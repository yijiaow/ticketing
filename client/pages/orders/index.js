const Orders = ({ orders }) => {
  return (
    <div>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>Order #{order.id}</p>
            <h4>
              {order.ticket.title} - {order.status}
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
};

Orders.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};

export default Orders;
