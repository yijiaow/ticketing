import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out...</div>;
};

export default Signout;
