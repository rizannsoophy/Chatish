import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

  //"proxy": "https://127.0.0.1:5000"
function Signup() {
    const navigate=useNavigate()
    const toast = useToast()
    const [show, setshow] = useState(false)
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [loading,setLoading] = useState(false)
    const [pic,setPic] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('');

    const handleClick=() => {
        setshow(!show)
    } 

    const postDetails=(pics) => {
      setLoading(true)
      if (pics===undefined){
        toast({
          title: 'Please select an umage',
          description: "Select some image",
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position:"bottom",
        })
        return
      }
      if (pics.type==='image/jpeg' || pics.type==='image/png'){
        const data=new FormData()
        data.append('file',pics)
        data.append("upload_preset","chatish")
        data.append("cloud_name","dxz7b306g")
        fetch("https://api.cloudinary.com/v1_1/dxz7b306g/image/upload", {
          method: "post",
          body: data,
        }).then((res)=>res.json())
        .then((data)=>{
          setPic(data.url.toString())
          console.log(data.url.toString());
          setLoading(false)
        })
        .catch((err)=>{
          console.log(err)
          setLoading(false)
        })
      }else{
        toast({
          title: 'Please select an image',
          description: "Select some image",
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position:"bottom",
        })
        setLoading(false)
        return
      }
    }

    const submitHandler=async() => {
      setLoading(true)
      if(!name||!email||!password||!confirmpassword){
        toast({
          title: 'Please fill all fields',
          description: "Select some image",
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position:"bottom",
        })
        setLoading(false)
        return
      }
      if(password!==confirmpassword){
        toast({
          title: 'Please fill all fields',
          description: "Select some image",
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position:"bottom",
        })
        return;
      }
      try {
        const config={
          headers:{
            "Content-type": "application/json",
          },
        };

        const {data} = await axios.post('https://chatish.onrender.com/api/user',{name,email,password,pic,},config)
        console.log(data);
        toast({
          title: 'Register successfull',
          description: "successfull",
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position:"bottom",
        })
        localStorage.setItem("userInfo",JSON.stringify(data))
        setLoading(false)
        navigate('/')

      } catch (error) {
        toast({
          title: 'Error occured',
          description: error.response.data.message,
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position:"bottom",
        })
        setLoading(false)
      }
    }

  return (
    <VStack
  spacing='5px'
  align='stretch'
  color='black'
>
  <FormControl id='first-name' isRequired>
    <FormLabel>Name</FormLabel>
        <Input placeholder='Enter your name' onChange={(e)=>setName(e.target.value)}/>
  </FormControl>
  <FormControl id='email' isRequired>
    <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)}/>
  </FormControl>
  <FormControl id='password' isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup size={'md'}>
    <Input type={show? 'text':'password'} placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)}/>
    <InputRightElement>
    <Button h='1.75rem' size="sm" onClick={handleClick} padding={'5px'}>
        {show? 'Hide' : 'Show'}
    </Button>
    </InputRightElement>
    </InputGroup>

    
        
    </FormControl>
    <FormControl id='confirm-password' isRequired>
    <FormLabel>Confirm Password</FormLabel>
    <InputGroup size={'md'}>
    <Input type={show? 'text':'password'} placeholder='Enter your password' onChange={(e)=>setConfirmpassword(e.target.value)} value={confirmpassword}/>
    <InputRightElement>
    <Button h='1.75rem' size="sm" onClick={handleClick} padding={'5px'}>
        {show? 'Hide' : 'Show'}
    </Button>
    </InputRightElement>
    </InputGroup>    
    </FormControl>
    <FormControl id='pic'>
        <FormLabel>Upload your picture</FormLabel>
        <Input type='file' p={1.5} accept='image/*' onChange={(e)=>postDetails(e.target.files[0])} />
    </FormControl>
    <Button colorScheme='blue' width={'100%'} style={{marginTop:"15px"}} onClick={submitHandler} isLoading={loading}>
        Sign Up
    </Button>
</VStack>
  )
}

export default Signup