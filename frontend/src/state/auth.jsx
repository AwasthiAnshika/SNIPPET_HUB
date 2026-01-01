import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=>{
    try{ const t = localStorage.getItem('token'); const u = JSON.parse(localStorage.getItem('user')||'null'); return { token: t, user: u }; }catch(e){ return null }
  })

  useEffect(()=>{
    if(user && user.token){ axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`; } else { delete axios.defaults.headers.common['Authorization']; }
    if(user){ localStorage.setItem('token', user.token || ''); localStorage.setItem('user', JSON.stringify(user.user||null)); } else { localStorage.removeItem('token'); localStorage.removeItem('user'); }
  }, [user]);

  const login = async (email, password)=>{
    const res = await axios.post(`${API}/auth/login`, { email, password });
    setUser({ token: res.data.token, user: res.data.user });
  }
  const register = async (name, email, password)=>{
    const res = await axios.post(`${API}/auth/register`, { name, email, password });
    setUser({ token: res.data.token, user: res.data.user });
  }
  const logout = ()=> setUser(null);

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = ()=> useContext(AuthContext)
