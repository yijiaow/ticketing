const Ticket = ({ ticket }) => {
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button className="btn btn-primary">Purchase</button>
    </div>
  );
};

Ticket.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default Ticket;
