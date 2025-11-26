import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, setChats, fetchUsersChats, setToken, token } = useAppContext()
  const [search, setSearch] = useState('')

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')
  }

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation()
      const confirm = window.confirm('Are you sure you want to delete this chat?')
      if (!confirm) return
      const { data } = await axios.post('/api/chat/delete', { chatId }, { headers: { Authorization: token } })
      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUsersChats()
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`flex flex-col h-screen w-65 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-cyan-500/20 transition-all duration-300 max-md:fixed max-md:left-0 max-md:z-50 max-md:shadow-2xl ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      {/* Top Section */}
      <div className='p-4 space-y-3 border-b border-gray-200 dark:border-cyan-500/10'>
        <div onClick={() => navigate('/')} className='cursor-pointer'>
          <h1 className='text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'>NexAI</h1>
          <p className='text-xs text-gray-500 dark:text-cyan-400/50 mt-1'>Advanced AI Assistant</p>
        </div>
        <button onClick={createNewChat} className='w-full py-2 px-3 text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-xs rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-200'>
          ✨ New Chat
        </button>
        <div className='flex items-center gap-2 px-2 py-2 border border-gray-300 dark:border-cyan-500/30 rounded-lg bg-gray-50 dark:bg-slate-900'>
          <img src={assets.search_icon} className='w-4 h-4 object-contain filter not-dark:invert' alt="search" />
          <input
            onChange={e => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder='Search chats...'
            className='text-xs outline-none bg-transparent text-gray-900 dark:text-white w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 '
          />
        </div>
      </div>

      {/* Chats Section */}
      <div className='flex-1 flex flex-col min-h-0 p-2 overflow-hidden'>
        {chats.length > 0 &&
          <p className='text-xs font-bold text-gray-700 dark:text-cyan-300 uppercase tracking-wide mb-2 flex-shrink-0'>Recent</p>
        }
        <div className='flex-1 overflow-auto space-y-1 pr-1 custom-scrollbar'>
          {
            chats.filter((chat) =>
              chat.messages[0] ?
                chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) :
                chat.name.toLowerCase().includes(search.toLowerCase())
            ).map((chat) => (
              <div
                onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }}
                key={chat._id}
                className='p-2 bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-cyan-500/20 rounded-lg cursor-pointer flex justify-between items-start group hover:bg-gray-100 dark:hover:bg-slate-900/80 transition-all duration-150'
                style={{ minHeight: 44, maxHeight: 62 }}
              >
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-gray-900 dark:text-white font-normal text-xs'>
                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 36) : chat.name}
                  </p>
                  <p className='text-[10px] text-gray-400 dark:text-cyan-400/50 mt-1.5'>{moment(chat.updatedAt).fromNow()}</p>
                </div>
                <img
                  src={assets.bin_icon}
                  className='h-4 cursor-pointer invert dark:invert-0 hidden group-hover:block flex-shrink-0'
                  alt="delete"
                  onClick={e => toast.promise(deleteChat(e, chat._id), { loading: 'Deleting...' })}
                  style={{ minWidth: 16 }}
                />
              </div>
            ))
          }
        </div>
      </div>

      {/* Bottom Section */}
      <div className='p-2 space-y-1 '>
        <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-cyan-500/20 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-150'>
          <img src={assets.gallery_icon} className='w-4 h-4 object-contain not-dark:invert' alt="gallery" />
          <p className='text-xs text-gray-900 dark:text-white font-normal'>Gallery</p>
        </div>

        <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-cyan-500/20 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-150'>
          <img src={assets.diamond_icon} className='w-4 h-4 object-contain filter dark:invert flex-shrink-0' alt="credits" />
          <p className='text-xs text-gray-900 dark:text-white font-normal'>Credits: <span className='text-cyan-600 dark:text-cyan-400 font-semibold'>{user?.credits}</span></p>
        </div>

        <div className='flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-cyan-500/20'>
          <div className='flex items-center gap-2'>
            <img src={assets.theme_icon} className='w-4 h-4 object-contain invert dark:invert-0' alt="theme" />
            <p className='text-xs text-gray-900 dark:text-white font-normal'>Dark</p>
          </div>
          <label className='relative inline-flex cursor-pointer'>
            <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className="sr-only peer" checked={theme === 'dark'} />
            <div className='w-8 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-cyan-500 transition-colors'></div>
            <span className='absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
          </label>
        </div>

        <div className='flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-cyan-500/20 cursor-pointer group hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-150'>
          <img src={assets.user_icon} className='w-5 h-5 rounded-full object-cover flex-shrink-0' alt="user" />
          <p className='text-xs text-gray-900 dark:text-white font-normal flex-1 truncate'>{user ? user.name.split(' ')[0] : 'Login'}</p>
          {user && <img onClick={logout} src={assets.logout_icon} className='h-4 cursor-pointer invert dark:invert-0 hidden group-hover:block flex-shrink-0' alt="logout" />}
        </div>
      </div>

      <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-2 right-2 w-4 h-4 cursor-pointer md:hidden dark:invert' alt="close" />
    </div>
  )
}

export default Sidebar
