import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const containerRef = useRef(null)

  const {selectedChat, theme, user, axios, token, setUser} = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e) => {
    try {
      e.preventDefault() 
      if(!user) return toast('Login to send message')
        setLoading(true)
        const promptCopy = prompt
        setPrompt('')
        setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])

        const {data} = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, prompt, isPublished}, {headers: { Authorization: token }})

        if(data.success){
          setMessages(prev => [...prev, data.reply])
          // decrease credits
          if (mode === 'image'){
            setUser(prev => ({...prev, credits: prev.credits - 2}))
          }else{
            setUser(prev => ({...prev, credits: prev.credits - 1}))
          }
        }else{
          toast.error(data.message)
          setPrompt(promptCopy)
        }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  },[messages])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      
      {/* Chat Messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-4 text-primary'>
            <div className='text-6xl sm:text-7xl font-bold bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent'>NexAI</div>
            <p className='mt-2 text-3xl sm:text-5xl text-center text-black dark:text-white font-light'>Welcome to <span className='font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>NexAI</span></p>
            <p className='text-sm text-black dark:text-gray-400'>Your intelligent AI assistant powered by advanced technology</p>
          </div>
        )}

        {messages.map((message, index)=> <Message key={index} message={message}/>)}

        {/* Three Dots Loading  */}
        {
          loading && <div className='loader flex  items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }
      </div>

        {mode === 'image' && (
          <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2 rounded-full border border-cyan-400/30'>
            <p className='text-xs text-white'>Publish to Community Gallery</p>
            <input type="checkbox" className='cursor-pointer accent-cyan-400' checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)}/>
          </label>
        )}

      {/* Prompt Input Box */}
      <form onSubmit={onSubmit} className='bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-cyan-500/40 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center shadow-lg dark:shadow-cyan-500/20 hover:dark:shadow-cyan-500/40 transition-all duration-300'>
        <select onChange={(e)=>setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none bg-transparent text-gray-900 dark:text-white font-medium'>
          <option className='bg-gray-100 dark:bg-gray-900' value="text">Text</option>
          <option className='bg-gray-100 dark:bg-gray-900' value="image">Image</option>
        </select>
        <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} type="text" placeholder="Type your prompt here..." className='flex-1 w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400' required/>
        <button disabled={loading} className='hover:scale-110 transition-transform'>
          <img src={loading ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer dark:invert' alt="" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
