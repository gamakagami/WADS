import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../contexts/AuthContext";
import { useState } from "react";
import {
  getUsersQueryOptions,
  useCreateUsers,
} from "../queryOptionsFolders/usersQuery";
import UserFilter from "../features/userManagement/UserFilter";
import UserTable from "../features/userManagement/UserTable";
import TicketPagination from "../features/tickets/TicketPagination";
import CreateUserPopup from "../features/userManagement/CreateUserPopup";
import getTimezone from "../utils/getTimezone";
import toast from "react-hot-toast";

export default function UserManagement() {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Admin user and users data
  const { user } = useAuthContext();
  const { data, isLoading } = useQuery(
    getUsersQueryOptions(user.accessToken, currentPage)
  );

  // Filters
  const [filterRoles, setFilterRoles] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(null);

  // Popup
  const [showPopup, setShowPopup] = useState(false);

  // Create user
  const { mutate: createUser, isLoading: updating } = useCreateUsers(
    user.accessToken
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("user");

  const timezone = getTimezone();

  // Errors
  const [errors, setErrorMsg] = useState("");

  // Onclick Functions
  function handleApplyFilter() {
    const filtered = data.data.filter((user) => {
      if (filterRoles === "all") return true;
      else return user.role === filterRoles;
    });

    if (keyword) {
      const filteredWithKeyword = filtered.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.role.toLowerCase().includes(keyword.toLowerCase()) ||
          user.department?.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      setFilteredUsers(filteredWithKeyword);
    } else {
      setFilteredUsers(filtered);
    }
  }

  function handlePopup() {
    setShowPopup(!showPopup);
    setErrorMsg("");
  }

  function handleCreateUser() {
    createUser(
      {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNum,
        password,
        department,
        role,
        timezone,
      },
      {
        onSuccess: () => {
          toast.success("Successfully created a user!", {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
          });
          setFirstName("");
          setLastName("");
          setPassword("");
          setEmail("");
          setNumber("");
          setDepartment("");
          setRole("user");
          setErrorMsg(""); // Clear any previous error
          handlePopup();
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create user";
          setErrorMsg(message);
        },
      }
    );
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {showPopup && (
        <CreateUserPopup
          handlePopup={handlePopup}
          handleCreate={handleCreateUser}
          setFname={setFirstName}
          setLname={setLastName}
          setEmail={setEmail}
          setPass={setPassword}
          setPhoneNum={setNumber}
          setDept={setDepartment}
          setRole={setRole}
          errorMsg={errors}
        />
      )}
      <UserFilter
        setFilter={setFilterRoles}
        applyFilter={handleApplyFilter}
        keyword={keyword}
        setKeyword={setKeyword}
        handlePopup={handlePopup}
      />
      <UserTable data={filteredUsers ? filteredUsers : data.data} />
      <TicketPagination
        data={data}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
