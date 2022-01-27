import useLoad from '../../../hooks/useLoad'
import { useEditorStore } from '../../../store/useEditorStore'

export const useFlowMessage = () => {
  const { loadNodeAndAppend } = useLoad()
  const node = useEditorStore((s) => s.node)

  const addContent = (msg: string) => {
    const content = [
      {
        id: 'TEMP_CcPFY9NRNDenbUy6pFdYf',
        children: [
          {
            id: 'TEMP_MijDnKGtkMretRLzKtRFm',
            text: '',
            type: 'p'
          },
          {
            type: 'sync_block',
            id: 'SYNC_REPLY',
            properties: {
              content: msg,
              igid: 'INTENTGROUP_ONBOARD',
              templateId: 'SYNCTEMP_ONBOARD',
              service: 'ONBOARD'
            },
            children: [
              {
                id: 'defaultValue',
                text: '',
                type: 'p'
              }
            ]
          },
          {
            id: 'TEMP_kzGxERTYkFk7WqbPM3xzn',
            text: '',
            type: 'p'
          }
        ],
        type: 'p'
      }
    ]
    loadNodeAndAppend(node.nodeid, content)
  }

  return {
    addContent
  }
}

export const snippetTourContent = [
  {
    id: 'TEMP_CcPFY9NRNDenbUy6pcool',
    type: 'p',
    children: [
      {
        id: 'TEMP_MijDnKGtkMretRLzKtaaa',
        text: "Let's get started with a quick tour of mex"
      }
    ]
  }
]

export const tourNodeContent = [
  {
    id: 'TEMP_pfgMWhHAyUidBcTV9d4XN',
    type: 'h2',
    children: [
      {
        id: 'TEMP_de3bx4MhRhn4VmHDrmMzf',
        text: 'Welcome to Mex'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '',
        id: 'TEMP_bidmbhnwc7LABjTbn6r7M'
      }
    ],
    id: 'TEMP_YdPgmkYaLwrDYahpnVa4C'
  },
  {
    id: 'TEMP_aQGQYgLNKUqj74qEVQaG8',
    type: 'p',
    children: [
      {
        id: 'TEMP_AXAyXJpQCVA3twWz9WE73',
        text: 'This is an example of '
      },
      {
        id: 'TEMP_PiYG8mcFEhkeMJPebhrCU',
        text: 'Quick link',
        bold: true,
        italic: true
      }
    ]
  },
  {
    id: 'TEMP_kNaNQMCKyp9PX7kUTU4gw',
    type: 'p',
    children: [
      {
        id: 'TEMP_RGmQ9fLWDmc8rj97WJWeb',
        text: ''
      },
      {
        type: 'ilink',
        children: [
          {
            text: '',
            id: 'TEMP_J69kjz8kjKdVqVxnjKdX8'
          }
        ],
        value: 'doc',
        id: 'TEMP_xmqLMQbJhVy64WXtdhe4j'
      },
      {
        text: ''
      }
    ]
  },
  {
    id: 'TEMP_pPcDipLQgAwQrXQ9UydUQ',
    type: 'p',
    children: [
      {
        id: 'TEMP_wdAywnBhX683qR6fWdXRH',
        text: ''
      }
    ]
  },
  {
    id: 'TEMP_WwBGzGc3ij7pxpCWdjgm4',
    type: 'p',
    children: [
      {
        id: 'TEMP_Pjdwmaznx7gjGpFWt3Mdc',
        text: 'This is an example of '
      },
      {
        id: 'TEMP_AArhiMRzNmzDRL6pALjPg',
        text: 'Inline Block',
        bold: true,
        italic: true
      }
    ]
  },
  {
    id: 'TEMP_L6nK6gfH8F6w3nq83k8rV',
    type: 'p',
    children: [
      {
        text: '',
        id: 'TEMP_nbNbeUtVjwYd3xh3nNE9F'
      },
      {
        type: 'inline_block',
        children: [
          {
            text: '',
            id: 'TEMP_Ji4t6QyJ7htQzNPWEi6tA'
          }
        ],
        value: 'doc',
        id: 'TEMP_Uk8cU3tQ3hmtktAXMXttd'
      },
      {
        id: 'TEMP_UpHcAfFrwYmJMxmq7PA3z',
        bold: true,
        italic: true,
        text: ''
      }
    ]
  }
  // {
  //   id: 'TEMP_MRyHTtTNcCbLmDWWeXCjc',
  //   type: 'p',
  //   children: [
  //     {
  //       id: 'TEMP_GrfznizUdipLTdqLbtMh6',
  //       text: ''
  //     },
  //     {
  //       type: 'sync_block',
  //       children: [
  //         {
  //           text: '',
  //           id: 'TEMP_4yDCTyG9LnKBb8MGzAGhV'
  //         }
  //       ],
  //       id: 'SYNC_FLOW'
  //     },
  //     {
  //       text: '',
  //       id: 'TEMP_8wgPkCGVrWT7ahVeixGBw'
  //     }
  //   ]
  // }
]
