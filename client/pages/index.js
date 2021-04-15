import axios from 'axios';

const Home = ({ currentUser }) => {
  console.log('Current User', currentUser);
  return (
    <div>
      <h1>Landing Page</h1>
    </div>
  );
};

Home.getInitialProps = async ({ req, res }) => {
  if (typeof window === 'undefined') {
    // On the server
    // Requests should be made to http://<service-name>.<namespace-name>.svc.cluster.local/...
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user',
      {
        // headers: {
        //   Host: 'ticketing.dev',
        // },
        headers: req.headers,
      }
    );
    return data;
  } else {
    // On the browser
    // Requests can be made with base url of an empty string
    const { data } = await axios.get('/api/users/current-user');
    return data;
  }
  return {};
};

export default Home;
