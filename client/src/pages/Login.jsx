import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {axios, setToken} = useAppContext()

    const handleSubmit = async (e) => {
      e.preventDefault();
      const url = state === "login" ? '/api/user/login' : '/api/user/register'

      try {
        const {data} = await axios.post(url, {name, email, password})
        if(data.success){
            setToken(data.token)
            localStorage.setItem('token', data.token)
        }else{
            toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-300 rounded-xl shadow-2xl border border-cyan-400/30 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 backdrop-blur-xl">
            <p className="text-3xl font-bold m-auto bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NexAI {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p className="text-white text-sm font-semibold">Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter your name" className="border border-cyan-400/30 rounded-lg w-full p-3 mt-1 outline-cyan-400 bg-gray-800/50 text-white placeholder:text-gray-500" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p className="text-white text-sm font-semibold">Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter your email" className="border border-cyan-400/30 rounded-lg w-full p-3 mt-1 outline-cyan-400 bg-gray-800/50 text-white placeholder:text-gray-500" type="email" required />
            </div>
            <div className="w-full ">
                <p className="text-white text-sm font-semibold">Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your password" className="border border-cyan-400/30 rounded-lg w-full p-3 mt-1 outline-cyan-400 bg-gray-800/50 text-white placeholder:text-gray-500" type="password" required />
            </div>
            {state === "register" ? (
                <p className="text-sm">
                    Already have account? <span onClick={() => setState("login")} className="text-cyan-400 cursor-pointer hover:text-cyan-300 font-semibold">click here</span>
                </p>
            ) : (
                <p className="text-sm">
                    Create an account? <span onClick={() => setState("register")} className="text-cyan-400 cursor-pointer hover:text-cyan-300 font-semibold">click here</span>
                </p>
            )}
            <button type='submit' className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all text-white w-full py-3 rounded-lg cursor-pointer font-semibold shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
  )
}

export default Login
