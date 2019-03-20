import Axios from "axios";
import { Auth0Config } from "../Data/ArtesianServiceConfig";

export const Auth0Service = (cfg: Auth0Config) =>
  Axios.post(
    `https://${cfg.domain}/oauth/token`,
    {
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      audience: cfg.audience,
      grant_type: "client_credentials"
    },
    { headers: { "content-type": "application/json" } }
  ).then((res: { data: any }) => res.data);
