import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // On the server
    // Requests should be made to http://<service-name>.<namespace-name>.svc.cluster.local/...
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // On the browser
    // Requests can be made with base url of an empty string
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
