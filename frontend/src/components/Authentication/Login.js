import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../Context/ChatProvider'

function Login() {

    const toast = useToast()
    const [show, setshow] = useState(false)
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [loading,setLoading] = useState(false)
    const navigate=useNavigate()
    const {setUser} = useContext(ChatContext)

    const handleClick=() => {
        setshow(!show)
    }
    const submitHandler=async() => {
      setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "https://chatish.onrender.com/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      ;
      setUser(data)
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    }


  return (
    <VStack
  spacing='5px'
  align='stretch'
  color='black'
>
  
  <FormControl id='first-name-login' isRequired>
    <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
  </FormControl>
  <FormControl id='password-login' isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup size={'md'}>
    <Input type={show? 'text':'password'} placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
    <InputRightElement>
    <Button h='1.75rem' size="sm" onClick={handleClick} padding={'5px'}>
        {show? 'Hide' : 'Show'}
    </Button>
    </InputRightElement>
    </InputGroup>    
    </FormControl>
    
    
    <Button colorScheme='blue' width={'100%'} style={{marginTop:"15px"}} onClick={submitHandler} isLoading={loading}>
            Login
    </Button>
    <Button colorScheme='red' width={'100%'} style={{marginTop:"15px"}} onClick={()=>{
        setEmail('guest@example.com');
        setPassword('123456');
    }
    }>
            Get guest user credential
    </Button>
</VStack>
  )
}

export default Login