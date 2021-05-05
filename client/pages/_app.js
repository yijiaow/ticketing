import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import buildClient from '../utils/buildClient';
import Header from '../components/Header';

const MyApp = ({ Component, pageProps, currentUser }) => (
  <>
    <Header currentUser={currentUser} />
    <div className="container">
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  </>
);

MyApp.getInitialProps = async (appContext) => {
  const apiClient = buildClient(appContext.ctx);
  const { data } = await apiClient.get('/api/users/current-user');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      apiClient,
      data.currentUser
    );
  }

  return { pageProps, ...data };
};

export default MyApp;
