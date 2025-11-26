import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const { axios } = useAppContext()

  const fetchImages = async () => {
    try {
      const {data} = await axios.get('/api/user/published-images')
      if (data.success) {
        setImages(data.images)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchImages()
  },[])

  if(loading) return <Loading />

  return (
    <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll'>
      <h2 className='text-3xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>Community Gallery</h2>

      {images.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-5'>
          {images.map((item, index)=>(
            <a key={index} href={item.imageUrl} target='_blank' className='relative group block rounded-lg overflow-hidden border border-cyan-400/30 dark:border-cyan-500/40 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300'>
              <img src={item.imageUrl} alt="" className='w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'/>
              <p className='absolute bottom-0 right-0 text-xs bg-black/60 backdrop-blur text-cyan-100 px-4 py-2 rounded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300'>Created by {item.userName}</p>
            </a>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-600 dark:text-cyan-200/70 mt-10'>No images available yet. Create and share one!</p>
      )}
    </div>
  )
}

export default Community
