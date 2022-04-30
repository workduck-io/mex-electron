import { mog } from '../../../utils/lib/helper'
import { useActionStore } from './useActionStore'

const dummyAuthGithub = (id: string) => {
  return {
    type: 'github',
    name: 'Github',
    description: 'Connect to Github',
    icon: 'github', //TODO add icon
    url: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_USER_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_HOST}/verifyUser/github&state=${id}&response_type=code&audience&scope=repo,read:user,read:org,notifications`
  }
}
