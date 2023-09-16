import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ChatContext } from '../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from '../components/Authentication/ChatLoading'
import UserListItem from '../components/UserAvatar/UserListItem'
import { getSender } from '../config/ChatLogics'
import Badge from '@mui/material-next/Badge';



function SideDrawer() {

    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const{user,setSelectedChat,chats, setChats,notification, setNotification} = useContext(ChatContext)

    const navigate = useNavigate()

    const logoutHandler=()=>{
      localStorage.removeItem("userInfo")
      navigate('/')
    }

    const handleSearch= async (query)=>{
      if(!search){
        toast({
          title: 'Enter a user name',
          description: "Enter a user to search for",
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position:'top-left'
        })
        return
      }
      try{
        setLoading(true)
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
          withCredentials: true,
        };
        console.log(user.token)
        console.log(search)
        const {data}=await axios.get(`/api/user?search=${search}`,config);
        console.log(data)
        setLoading(false)
        setSearchResult(data)
        console.log(searchResult);
      }catch(error){
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }

    const accessChat= async (userId)=>{
      try{
        setLoadingChat(true)
        const config = {
          headers:{
            "Content-type": "application/json",
            Authorization:`Bearer ${user.token}`,
          },
        }
        console.log(user.token)
        const { data } = await axios.post(`/api/chat`, { userId }, config);

        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        console.log(userId)
        console.log(data)

        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      }catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
     
      }
    }
  return (
    <div>
        <Box display='flex' justifyContent='space-between' alignItems='center' bg='white' w='100%' p="5px 10px 5px 10px" borderWidth="5px">
            <Tooltip label="Search users to chat" hasArrow placement='bottom-end'>
            <Button variant='ghost' onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{base:"none",md:"flex"}} px='4'>Search User</Text>
            </Button>
            </Tooltip>
            <Text fontSize="2xl" fontFamily="Work sans">
              Chatish
            </Text>
            <div>
            <Menu>
              <MenuButton as={Button} p={1}>
              <Badge badgeContent={notification.length} color="primary">
                <BellIcon fontSize='2xl'/>
              </Badge>
              </MenuButton>
              <MenuList paddingLeft='3'>
                {!notification.length && " No new messages"}
                {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
              </MenuButton>
              <MenuList>
              <ProfileModal user={user}>
              <MenuItem>
                My Profile
              </MenuItem>
              </ProfileModal>
                
                <MenuDivider/>
                <MenuItem onClick={logoutHandler}>Log out</MenuItem>
              </MenuList>
            </Menu>
            </div>
        </Box>
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
            <Input placeholder='Search by name or email'
            mr={2}
            value={search}
            onChange={(e)=>setSearch(e.target.value)} />
            <Button onClick={handleSearch}>
              Go
            </Button>
            </Box>
            {
              loading ? (<ChatLoading/>):
              (searchResult.map((user) =>(
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}/>
              )))
            }
            
            {loadingChat && <Spinner ml="auto" d="flex" />}

          </DrawerBody>

          
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SideDrawer