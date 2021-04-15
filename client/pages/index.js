import buildClient from '../utils/buildClient';

const Home = ({ currentUser }) => {
  console.log('Current User', currentUser);
  return currentUser ? (
    <div>
      <h1>You are signed in!</h1>
    </div>
  ) : (
    <div>
      <h1>You are not signed in.</h1>
    </div>
  );
};

Home.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/current-user');

  return data;
};

export default Home;
