import { Amplify } from '@aws-amplify/core'
import config from '../config'

export default function initializeAmplify () {
  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
      endpoints: [
        {
          name: 'mex',
          endpoint: 'https://xabdow1opb.execute-api.us-east-1.amazonaws.com/dev',
          region: 'us-east-1'
        }
      ]
    }
  })
}
