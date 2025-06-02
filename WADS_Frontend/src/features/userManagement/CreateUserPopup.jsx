import CreateInput from "./CreateInput"
import CreateDropdown from "./CreateDropdown"
import { useState } from "react"

export default function CreateUserPopup({
    handlePopup, 
    handleCreate, 
    setFname,
    setLname,
    setEmail,
    setPass,
    setDept,
    setPhoneNum,
    setRole,
    errorMsg
}){

    const roles = ["user", "agent", "admin"]
    return(
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="bg-white rounded-sm shadow-xl w-full max-w-xl mx-4 flex flex-col p-4">
        <div className="bg-white text-black py-3 mb-4">
          <h2 className="text-xl font-semibold">Create User</h2>
        </div>

        {errorMsg !=="" ? <div className="w-full py-2 px-4 bg-red-200 border border-red-300 rounded-md mb-4">
            <h1 className="text-red-500 text-center">{errorMsg}</h1>
        </div> : <></>}

        <div>
            <div className="flex gap-4">
                <CreateInput title={"First Name"} type="text" onChange={setFname}/>
                <CreateInput title={"Last Name"} type="text" onChange={setLname}/>
            </div>
            <CreateInput title={"Email"} type="email" onChange={setEmail}/>
            <CreateInput title={"Phone Number"} type="number" onChange={setPhoneNum}/>
            <CreateInput title={"Password"} type="password" onChange={setPass}/>
            <CreateDropdown title={"Role"} options={roles} onChange={setRole}/>
        </div>

        <div className="flex gap-4">
            <button className="flex-grow text-center text-white bg-[#4AC180] p-2 rounded-sm hover:cursor-pointer mt-4 mx-auto" onClick={handleCreate}>Create</button>
            <button className="flex-grow text-center text-gray-600 border border-gray-300 p-2 rounded-sm hover:cursor-pointer mt-4 mx-auto" onClick={handlePopup}>Cancel</button>
        </div>
      </div>
    </div>
    )
}