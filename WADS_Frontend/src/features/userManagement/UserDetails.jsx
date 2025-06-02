import UserDetail from "./UserDetail"
import UserDetailSections from "./UserDetailSections"
import EditableUserDetail from "./EditableUserDetail"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DeletePopup from "./DeletePopup";
import { useState } from "react";
import { parseISO, format} from "date-fns";

export default function UserDetails({ user, updateUser, deleteUser }){

    const navigate = useNavigate()

    const [showPopup, setPopupStatus] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [confirmEmail, setConfirmEmail] = useState("")

    const roles = ["admin", "agent", "user"]
    const [userRole, updateRole] = useState(user.role)
    const [userDept, updateDept] = useState(user.department)

    function handleUpdate(){
        if(userRole !== user.role || userDept !== user.department){
            updateUser({
                role: userRole,
                department: userDept
            },{
            onSuccess: () => {
                toast.success("Successfully updated a user!", {
                duration: 4000,
                position: "top-right",
                style: {
                  background: "#4CAF50",
                  color: "#fff",
                },
              });
            },
            onError: (error) => {
                toast.error("Update failed!", {
                    duration: 4000,
                    position: "top-right",
                    style: {
                    background: "#F44336",
                    color: "#fff",
                    },
                });
            },
            })
        }
    }

    function handlePopup(){
        setPopupStatus(!showPopup)
        setErrorMessage("")
    }

    function handleDelete(){

        if(confirmEmail === user.email){
            deleteUser({},{
                onSuccess: () => {
                    toast.success("Successfully deleted a user!", {
                        duration: 4000,
                        position: "top-right",
                        style: {
                          background: "#4CAF50",
                          color: "#fff",
                        },
                      });
                    setErrorMessage("")
                    handlePopup();
                    navigate('/users')
                },
                onError: (error) => {
                    const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to delete user";
                    setErrorMessage(message);
                },
                })

        }
        else{
            setErrorMessage("Emails do not match!")
        }
    }

    return(
        <div className="w-full h-full p-4 bg-white border border-gray-300 rounded-md shadow-sm">
            {showPopup && 
                <DeletePopup 
                handleDelete={handleDelete}
                handlePopup={handlePopup} 
                onChange={setConfirmEmail}
                email={user.email}
                errorMsg={errorMessage}
                />
            }
            <div className="w-full p-8 border-b border-gray-300 flex items-center justify-center">
                {user.profilePicture?
                <img src={user.profilePicture} alt="" className="w-24 h-24 rounded-full"/>:
                <div className="w-24 h-24 rounded-full bg-[#1D3B5C] flex justify-center items-center">
                    <span className="text-white text-4xl font-bold">{user.firstName[0]} {user.lastName[0]}</span>
                </div>}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-none relative">
                <UserDetailSections title="User Details">
                    <UserDetail title={"First Name"} detail={user.firstName}/>
                    <UserDetail title={"Last Name"} detail={user.lastName}/>
                    <UserDetail title={"Email"} detail={user.email}/>
                    <UserDetail title={"Joined on"} detail={format(parseISO(user.createdAt), "yyyy-MM-dd")}/>
                </UserDetailSections>

                <UserDetailSections title="Configurations">
                    <EditableUserDetail options={roles} onChange={updateRole} value={userRole} title={"Role"}/>
                    <EditableUserDetail onChange={updateDept} value={userDept} title={"Department"}/>
                    <button onClick={handleUpdate} className="w-full text-center text-white bg-[#4A81C0] p-2 rounded-sm hover:cursor-pointer">Apply Changes</button>
                    <button onClick={handlePopup} className="w-full text-center text-white bg-[#FF6B6B] p-2 rounded-sm hover:cursor-pointer mt-4">Delete User</button>
                </UserDetailSections>
            </div>
        </div>
    )
}