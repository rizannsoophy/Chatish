import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import ProfileModal from '../../others/ProfileModal'
import UpdateGroupChatModal from '../../others/UpdateGroupChatModal'
import axios from 'axios'
import './style.css'
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client";
var socket, selectedChatCompare;
const ENDPOINT = "https://chatish.onrender.com"; 

function SingleChat({fetchAgain,setFetchAgain}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
    const { selectedChat, setSelectedChat, user, notification, setNotification}=useContext(ChatContext)
   
   

    const toast =useToast()

    useEffect(() => {
      socket=io(ENDPOINT)
      socket.emit("setup",user)
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    })


    
    useEffect(() => {
     socket.on("message recieved", (newMessageRecieved) => {
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageRecieved.chat._id)
         {
          if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
          }
       } else {
          setMessages([...messages, newMessageRecieved]);
        }
      });
    });

    
    useEffect(() => {
      fetchMessages()
      selectedChatCompare = selectedChat;
      }
    , [selectedChat])

    console.log(notification)
    
    const fetchMessages = async () => {
      if (!selectedChat) return;
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        setLoading(true);
  
        const { data } = await axios.get(
          `https://chatish.onrender.com/api/message/${selectedChat._id}`,
          config
        )
        setMessages(data);
        setLoading(false);

        socket.emit('join chat',selectedChat._id)
  
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
    const sendMessage=async (event)=>{
      if (event.key === "Enter" && newMessage) {
        socket.emit('stop Typing',selectedChat._id)
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          //console.log(user.token);
          setNewMessage("");
          const { data } = await axios.post(
            "https://chatish.onrender.com/api/message",
            {
              content: newMessage,
              chatId: selectedChat._id,
            },
            config
          );
          console.log(data)
          socket.emit("new message", data)
          
          setMessages([...messages, data]);
    }catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }}
    const typingHandler=(e)=>{
      setNewMessage(e.target.value)
      if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
    }

    
    

    


    
  return (
    <div>
        {selectedChat ? (
            <>
            <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
                <>
                {getSender(user,selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                </>
            ):(
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                    
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}/>
                    
                
                </>
            )}
            </Text>
            <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            width="100%"
            height="500px"
            borderRadius="lg"
            overflowY="hidden"
          >

            {loading ?(
              <Spinner
              size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
              />) :(
                <div className="messages">
                <ScrollableChat messages={messages}/>
              </div>
              )
            }
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {istyping ? <div>Typing</div> : (<></>)}
              <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message.."
              value={newMessage}
              onChange={typingHandler}
              />
            </FormControl>
          </Box>
            </>
        ):<Box display='flex' alignItems='center' justifyContent='center' h='100%'>
            <Text fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">
            Click on a user to start chatting
            </Text>
            
            </Box>}
    </div>
  )
}

export default SingleChat