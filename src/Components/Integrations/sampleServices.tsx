export const sampleServices = [
  {
    id: 'MEX',
    connected: true,
    type: 'node',
    styles: { color: '#d48fad', bgColor: '#3F0F3F' }
  },
  {
    id: 'SLACK',
    connected: false,
    type: 'channel',
    styles: { color: '#d48fad', bgColor: '#3F0F3F' }
  },
  {
    id: 'GITHUB',
    connected: false,
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
  slack: (workspaceId: string) =>
    `https://slack.com/oauth/v2/authorize?client_id=2165258643458.2292583429188&scope=app_mentions:read,channels:history,channels:read,chat:write,chat:write.customize,commands,conversations.connect:write,files:write,groups:history,groups:write,im:history,im:write,mpim:history,mpim:write,groups:read&user_scope=channels:history,channels:read,channels:write,chat:write,files:write,groups:history,groups:write,im:history,mpim:write,users:read,groups:read&redirect_uri=https%3A%2F%2F802e-106-200-236-145.ngrok.io%2Flocal%2Fverify%2Fslack%3FworkspaceId%3D${workspaceId}`,

  github: (workspaceId: string) => `https://github.com/apps/mex-demo-app/installations/new?state=${workspaceId}`
}
