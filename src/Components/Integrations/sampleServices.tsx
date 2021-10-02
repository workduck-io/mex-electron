export const sampleServices = [
  {
    id: 'mex',
    connected: true,
    type: 'node',
    styles: { color: '#d48fad', bgColor: '#3F0F3F' }
  },
  {
    id: 'slack',
    connected: false,
    type: 'channel',
    styles: { color: '#d48fad', bgColor: '#3F0F3F' }
  },
  {
    id: 'github',
    connected: true,
    type: 'repo',
    styles: { color: '#000000', bgColor: '#ffffff' }
  }
  // {
  //   id: 'telegram',
  //   connected: false,
  //   type: 'group',
  //   styles: { color: '#ffffff', bgColor: '#0088cc' }
  // },
  // {
  //   id: 'notion',
  //   connected: false,
  //   type: 'page',
  //   styles: { color: '#121212', bgColor: '#ffffff' }
  // },
]

export const authURLs = {
  slack:
    'https://slack.com/oauth/v2/authorize?client_id=2165258643458.2292583429188&scope=[…]0-236-145.ngrok.io%2Fverify%2Fslack%3FworkspaceId%3DWORKSPACE_id',
  github: 'https://github.com/apps/mex-demo-app/installations/new?state={workspaceId}'
}
