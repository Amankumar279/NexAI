import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const {token, axios } = useAppContext()

  const fetchPlans = async () => {
   try {
    const { data } = await axios.get('/api/credit/plan', {
      headers: { Authorization: token }
    })
    if (data.success){
      setPlans(data.plans)
    }else{
      toast.error(data.message || 'Failed to fetch plans.')
    }
   } catch (error) {
    toast.error(error.message)
   }
   setLoading(false)
  }

      const purchasePlan = async (planId) => {
        try {
          const { data } = await axios.post('/api/credit/purchase', {planId}, {headers: { Authorization: token }})
          if (data.success) {
            window.location.href = data.url
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message)
        }
      }

  useEffect(()=>{
    fetchPlans()
  },[])

  if(loading) return <Loading />

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>Credit Plans</h2>

      <div className='flex flex-wrap justify-center gap-8'>
        {plans.map((plan)=>(
          <div key={plan._id} className={`border border-cyan-400/30 dark:border-cyan-500/40 rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all p-6 min-w-[300px] flex flex-col ${plan._id === "pro" ? "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30" : "bg-white dark:bg-slate-900/50"}`}>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name}</h3>
              <p className='text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4'>${plan.price}
                <span className='text-base font-normal text-gray-600 dark:text-cyan-300/70'>{' '}/ {plan.credits} credits</span>
              </p>
              <ul className='list-disc list-inside text-sm text-gray-700 dark:text-cyan-100/70 space-y-1'>
                {plan.features.map((feature, index)=>(
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading: 'Processing...'})} className='mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:from-cyan-600 active:to-blue-600 text-white font-medium py-2 rounded-lg transition-all cursor-pointer shadow-lg shadow-cyan-500/30'>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
