import React, { useContext, useEffect, useState } from 'react'
import { ChatContext, ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../others/SideDrawer'
import MyChats from '../others/MyChats'
import ChatBox from '../others/ChatBox'

function Chat() {

   //const {user}=ChatState()
   const{user,setUser} = useContext(ChatContext)
   const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display='flex' justifyContent='space-between' width='100%' height='91.5vh' p='10px'>
      {user && <MyChats fetchAgain={fetchAgain}/>}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
        
    </div>
  )
}

export default Chat