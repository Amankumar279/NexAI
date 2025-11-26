import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({message}) => {

  useEffect(()=>{
    Prism.highlightAll()
  },[message.content])

  const messageStyle = "animate-fade-in-up";

  return (
    <div className={messageStyle}>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-3'>
          <div className='flex flex-col items-end gap-2'>
            <div className='p-3 px-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-600/30 dark:to-blue-600/30 border border-cyan-400/40 dark:border-cyan-500/50 rounded-2xl rounded-tr-none max-w-2xl'>
              <p className='text-base text-gray-800 dark:text-cyan-100'>{message.content}</p>
            </div>
            <span className='text-xs text-gray-500 dark:text-cyan-300/60'>
              {moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} alt="User" className='w-8 h-8 rounded-full'/>
        </div>
      )
      : 
      (
        <div className='flex items-start my-4 gap-3'>
            <img src={assets.logo} alt="Assistant" className='w-8 h-8 rounded-full p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20'/>
            <div className='flex flex-col items-start gap-2'>
                <div className='inline-flex flex-col gap-2 p-3 px-4 max-w-2xl bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-800/80 dark:to-slate-900/80 border border-gray-200 dark:border-cyan-500/30 rounded-2xl rounded-tl-none'>
                    {message.isImage ? (
                        <img src={message.content} alt="Generated content" className='w-full max-w-md mt-2 rounded-lg'/>
                    ):
                    (
                        <div className='text-base text-gray-800 dark:text-cyan-50 reset-tw'>
                        <Markdown>{message.content}</Markdown></div>
                    )}
                </div>
                <span className='text-xs text-gray-500 dark:text-cyan-300/60'>{moment(message.timestamp).fromNow()}</span>
            </div>
        </div>
      )
    }
    </div>
  )
}

export default Message
