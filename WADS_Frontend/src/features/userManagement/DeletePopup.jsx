export default function DeletePopup({handlePopup, handleDelete, onChange, email, errorMsg}){
    return(
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="bg-white rounded-sm shadow-xl w-full max-w-lg mx-4 flex flex-col p-4">
        <div className="bg-white text-black py-3 rounded-t-lg mb-4">
          <h2 className="text-xl font-semibold">Delete User</h2>
        </div>
        {errorMsg !=="" ? <div className="w-full py-2 px-4 bg-red-200 border border-red-300 rounded-md mb-4">
            <h1 className="text-red-500 text-center">{errorMsg}</h1>
        </div> : <></>}
        <p className="text-[#636363]">Please type in <strong>{email}</strong> to confirm deletion</p>
        <input 
            type="email" 
            onChange={(e) => onChange(e.target.value)} 
            className="w-full max-w-lg text-gray-600 border border-gray-400 py-2 px-4 rounded-sm mt-4 mx-auto"
        />
        <div className="flex gap-4">
            <button className="flex-grow text-center text-white bg-[#FF6B6B] p-2 rounded-sm hover:cursor-pointer mt-4 mx-auto" onClick={handleDelete}>Delete</button>
            <button className="flex-grow text-center text-gray-600 border border-gray-300 p-2 rounded-sm hover:cursor-pointer mt-4 mx-auto" onClick={handlePopup}>Cancel</button>
        </div>
        
      </div>
    </div>
    )
}