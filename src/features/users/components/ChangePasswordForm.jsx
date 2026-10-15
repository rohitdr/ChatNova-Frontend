import  {  useState } from 'react'
import { useChangePassword } from '../../auth/hooks/useChangePassword'
import { validatePassword } from '../services/validatePassword'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import { FaSpinner } from 'react-icons/fa'

export default function ChangePasswordForm({showAlert}) {
    const updatePassword=useChangePassword()
     const [form,setform]=useState({oldPassword:"",newPassword:"",confirmPassword:""})

     const handlePasswordChange=({target:{name,value}})=>{
         setform(prev=>({...prev,[name]:value}))
      }
   
      const isValidPassword =
      form.oldPassword.length >= 8 &&
      form.newPassword.length >= 8 &&
      form.confirmPassword === form.newPassword;
      const handlePasswordUpdate=(e)=>{
    e.preventDefault()
     const error = validatePassword(form)
     if(error){
      showAlert("Error",error)
      return
     }
     
      updatePassword.mutate({newPassword:form.newPassword,oldPassword:form.oldPassword})
       setform({oldPassword:"",newPassword:"",confirmPassword:""})
        
      }
  return (
  <div className="mx-4 mt-4 mb-10">
    <div className="flex items-center mb-2">
      <LockClosedIcon className="w-5 h-5 text-gray-700 mr-2" />
      <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
    </div>

    <form onSubmit={handlePasswordUpdate} className="bg-white rounded-2xl shadow-sm p-4 space-y-4">

      <input
        type="password"
        name="oldPassword"
        autoComplete="current-password"
        value={form.oldPassword}
        onChange={handlePasswordChange}
        placeholder="Old Password"
        className="input-modern"
      />

      <input
        type="password"
        name="newPassword"
        autoComplete="new-password"
        value={form.newPassword}
        onChange={handlePasswordChange}
        placeholder="New Password"
        className="input-modern"
      />

      <input
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={handlePasswordChange}
        placeholder="Confirm Password"
        className="input-modern"
      />

      <div className="flex justify-end">
        <button
        disabled={!isValidPassword || updatePassword.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50">
         {updatePassword.isPending ? <FaSpinner className="animate-spin w-5 h-5 text-white"></FaSpinner>:"Update"} 
        </button>
      </div>
    </form>
  </div>
  )
}
