const axios = require('axios');
const qs = require('querystring');

exports.GenerateToken = async () => {
  let result;

  const requestBody = {
    grant_type: 'client_credentials',
    client_id: 'PAR_diagoriente_df37fddfdc1aaa59aa87558357fbd49a10f02cb35aeb14cd419e54228385d63a',
    client_secret: '39a76c126f473401609aaf8d699830b9fb022cd5dae454067bdf3705f428b515',
    scope:
      'application_PAR_diagoriente_df37fddfdc1aaa59aa87558357fbd49a10f02cb35aeb14cd419e54228385d63a api_labonneboitev1'
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  await axios
    .post(
      'https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=%2Fpartenaire',
      qs.stringify(requestBody),
      config
    )
    .then((response) => {
      result = response;
    })
    .catch((error) => console.log(error.response.data));
  return result.data;
};
