// /* eslint-disable react/prop-types */
// import PlusCircle from '@iconify/icons-bi/plus-circle'
// import Document from '@iconify/icons-gg/file-document'
// import { Icon } from '@iconify/react'
// import React, { useRef, useState } from 'react'
// import { mog } from '../../../utils/lib/helper'
// import { useTheme } from 'styled-components'
// import { IpcAction } from '../../../data/IpcAction'
// import { appNotifierWindow } from '../../../electron/utils/notifiers'
// import { AppType } from '../../../hooks/useInitialize'
// import useLoad from '../../../hooks/useLoad'
// import { useSpotlightAppStore } from '../../../store/app.spotlight'
// import { useSpotlightContext } from '../../../store/Context/context.spotlight'
// import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
// import useDataStore from '../../../store/useDataStore'
// import { NoWrap, PrimaryText } from '../../../style/Integration'
// import { ActionTitle } from '../Actions/styled'
// import { Description, StyledResults, StyledRow } from './styled'
// import { ListItemType } from './types'
// import { useVirtual } from 'react-virtual'
// import { StyledKey } from '../Shortcuts/styled'
// import { Shortcut } from '../Home/components/Item'

// export const Result: React.FC<{
//   result: ListItemType
//   onClick: () => void
//   style?: any
//   selected?: boolean
//   key?: string
// }> = ({ result, selected, onClick, style }) => {
//   const theme = useTheme()
//   return (
//     <StyledRow showColor={selected} onClick={onClick} key={`STRING_${result.title}`}>
//       <div>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <Icon
//             color={theme.colors.primary}
//             style={{ marginRight: '8px' }}
//             height={18}
//             width={18}
//             icon={result.icon ?? 'gg:file-document'}
//           />
//           <div>{result?.title}</div>
//         </div>
//         <Description>{result?.description}</Description>
//       </div>
//       {selected && (
//         <Shortcut>
//           {result.shortcut && result.shortcut.map((shortcutKey, id) => <StyledKey key={id}>{shortcutKey}</StyledKey>)}
//         </Shortcut>
//       )}
//     </StyledRow>
//   )
// }

// const SearchResults: React.FC<{ current: number; data: Array<ListItemType> }> = ({ current, data }) => {
//   const ref = useRef<any>(undefined!)
//   const listContainerRef = useRef(null)

//   const rowVirtualizer = useVirtual({
//     size: data.length,
//     parentRef: listContainerRef
//   })

//   // destructuring here to prevent linter warning to pass
//   // entire rowVirtualizer in the dependencies array.
//   const { scrollToIndex } = rowVirtualizer

//   const { search } = useSpotlightContext()
//   const [selectedIndex, setSelectedIndex] = useState<number>(current)
//   const { addILink } = useDataStore()
//   const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

//   const setNode = useSpotlightEditorStore((s) => s.setNode)
//   const { getNode } = useLoad()

//   // const props = useSpring({ width: search ? '40%' : '100%', display: 'block', opacity: search ? 1 : 0 })

//   // const transitions = useTransition(rowVirtualizer.virtualItems, {
//   //   from: {
//   //     marginTop: 0,
//   //     opacity: 0,
//   //     transform: 'translateY(-4px)'
//   //   },
//   //   enter: {
//   //     marginTop: 0,
//   //     opacity: 1,
//   //     transform: 'translateY(0px)'
//   //   },
//   //   trail: 100
//   // })

//   React.useEffect(() => {
//     scrollToIndex(current, {
//       // To ensure that we don't move past the first item
//       align: current < 1 ? 'start' : 'auto'
//     })
//     setSelectedIndex(current)
//   }, [current, scrollToIndex])

//   const handleCreateItem = () => {
//     const nodeid = addILink({ ilink: search.value }).nodeid
//     setNode(getNode(nodeid))
//     appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, nodeid)
//     setNormalMode(false)
//   }

//   const withNew = data?.length > 0 && data[0]?.extras.new

//   return (
//     <StyledResults ref={listContainerRef} margin={search.value}>
//       {rowVirtualizer.virtualItems.map((item) => {
//         const result = data[item.index]
//         const index = item.index
//         if (result?.extras?.new) {
//           return (
//             <StyledRow showColor={index === selectedIndex} onClick={handleCreateItem} key="wd-mex-create-new-node">
//               <NoWrap>
//                 <Icon style={{ marginRight: '8px' }} height={24} width={24} icon={PlusCircle} />
//                 <div>
//                   Create new <PrimaryText>{search.value}</PrimaryText>
//                 </div>
//               </NoWrap>
//             </StyledRow>
//           )
//         }
//         return (
//           <>
//             {((withNew && index === 1) || (!withNew && index === 0)) && <ActionTitle>SEARCH RESULTS</ActionTitle>}
//             <Result
//               key={`RESULT_${result?.description || String(index)}`}
//               selected={index === selectedIndex}
//               onClick={() => {
//                 setSelectedIndex(index)
//               }}
//               result={result}
//             />
//           </>
//         )
//       })}
//       {data?.length === 0 && <ActionTitle>There&apos;s nothing with that name here...</ActionTitle>}
//     </StyledResults>
//   )
// }

// export default SearchResults
