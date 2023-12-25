// ---------------------      IMPORT Statement     -------------------------------------------------// 
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,TableSortLabel 
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AvatarIMg from "../assets/admin.svg";
import CustomModal from "./modal/CustomModal";
import { TextField, Typography } from "@mui/material";
import DeleteIcon from "../assets/delete.png";
import { useDispatch, useSelector } from "react-redux";
import { removeTodo, editTodo } from "../features/customer/CustomerSlice";
import { handleFetchError } from '../constants/ErrorHandlers.js';

import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebase/firebaseConfig.js";
import {editSuccesFull,editFailed}  from '../constants/SwallFire.js'
import { FallingLines } from "react-loader-spinner";
import Swal from "sweetalert2";



const TableData = () => {
// ---------------             State Mangement      --------------------------------------------------//
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [selectedUser, setSelectedUser] = useState(null);
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  //---------------------      Edit Todo          --------------------------------------------//
  const handleEdit = (userId) => {
    const userToEdit = data.find((user) => user.id === userId);
    setSelectedUser(userToEdit);
    console.log("userId", userId);
    setOpen(true);
  };

  //--------------------cc     Customer Updated   -----------------------------------------cc//
  const handleUpdate = () => {
    setIsLoading(true)
    try {
      dispatch(
        editTodo({
          id: selectedUser.id,
          first_name: selectedUser.first_name,
          email: selectedUser.email,
          avatar: selectedUser.avatar,
        })
      );
      setIsLoading(false)
      editSuccesFull()
      setOpen(false);
    } catch (error) {
      editFailed()
    }
  };  //  Customer Edit End here
  

  //------------------cc       Customer Delete Functionaliy    --------------------------------cc//
  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    try {
      if (selectedUserId) {
        dispatch(removeTodo(selectedUserId));

        const localData = JSON.parse(localStorage.getItem("CustomerTodos"));
        const updatedLocalData = [
          ...localData.filter((todo) => todo.id !== selectedUserId),
        ];
        localStorage.setItem("CustomerTodos", JSON.stringify(updatedLocalData));

        setData((prevData) => updatedLocalData);
        setSelectedUserId(null);
        setOpenDeleteModal(false);
        Swal.fire({
          title: "Success",
          text: "delete successfully",
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: error.message,
        text: "Login failed",
        icon: "error",
      });
    }
  };
  // Customer Delete Functionality End Here

  //--------------------        User Fetch data        --------------------------------------//
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const localData = localStorage.getItem("CustomerTodos");
      if (localData) {
        setData(JSON.parse(localData));
      } else {
        const res = await axios.get("https://reqres.in/api/users?page=1");
        setData(res.data.data);
        localStorage.setItem("CustomerTodos", JSON.stringify(res.data.data));
      }
    } catch (error) {
      handleFetchError(error);
    }
  };
  
  
  /////// user fetch data end here

//---------------------      image upload logic      -------------------------------------// 
  const handleAvatarChange = async (event) => {
    try {
      const file = event.target.files[0];
      setImage(file); 
      const downloadURL = await imageUpload(file);

      const updatedUser = { ...selectedUser, avatar: downloadURL };

      dispatch(editTodo(updatedUser));
      const updatedData = data.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      localStorage.setItem("CustomerTodos", JSON.stringify(updatedData));
  
      setSelectedUser(updatedUser);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };
  
  //------------------------    Updated image upload logic    -------------------------------//
  const imageUpload = async (file) => {
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // Handle upload progress
          },
          (error) => {
            setIsLoading(false);
            console.error("Error uploading file:", error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                setIsLoading(false);
                resolve(downloadURL);
                console.log("File available at", downloadURL);
              })
              .catch((error) => {
                setIsLoading(false);
                console.error("Error getting download URL:", error);
                reject(error);
              });
          }
        );
      });
    }
  };
  
//---------------------------    data sort logic               ------------------------------//
 const handleRequestSort = (property) => {
  const isAsc = orderBy === property && order === "asc";
  setOrder(isAsc ? "desc" : "asc");
  setOrderBy(property);

  let sortedData = [...data];
  switch (property) {
    case "id":
      sortedData.sort((a, b) =>
        order === "asc" ? a.id - b.id : b.id - a.id
      );
      break;
    case "first_name":
      sortedData.sort((a, b) =>
        order === "asc"
          ? a.first_name.localeCompare(b.first_name)
          : b.first_name.localeCompare(a.first_name)
      );
      break;
    case "email":
      sortedData.sort((a, b) =>
        order === "asc"
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email)
      );
      break;
    default:
      break;
  }
  setData(sortedData);
};

  return (
    <div style={{maxHeight: 440,width: '100%', overflow: 'scroll' }}>
      {/* table data container */}
      <Table aria-label="sticky table"
        style={{
          border: "1px solid black",
          width: "90%",
          marginLeft: "55px",
          marginTop: "30px",
          position: "sticky",
          overflow: "scroll",
        }}
      >
        <TableHead style={{ backgroundColor: "#c5e3d6",}}>
          <TableRow className="sticky">
            <TableCell></TableCell>
        
            <TableCell
              style={{ color: "#015249", fontWeight: "700",cursor:'pointer'  }}
              sx={{
                tableCellResponsive: true,
              }}
              active={orderBy === "id" ?true : undefined} 
              direction={orderBy === "id" ? order : "asc"}
              onClick={() => handleRequestSort("id")}
            >
              Customer ID ⇊
            </TableCell>
            <TableCell
              sx={{
                tableCellResponsive: true,
              }}
                style={{ color: "#015249", fontWeight: "700" ,cursor:'pointer' }}
                direction={orderBy === "first_name" ? order : "asc"}
                active={orderBy === "first_name" ? true : undefined}

                onClick={() => handleRequestSort("first_name")}
            >
              Customer Name ⇊
            </TableCell>
            <TableCell style={{ color: "#015249", fontWeight: "700",cursor:'pointer' }}
            active={orderBy === "email" ? true : undefined}
            direction={orderBy === "email" ? order : "asc"}
            onClick={() => handleRequestSort("email")}
            >
              Email ⇊ 
            </TableCell>
            <TableCell
              sx={{
                tableCellResponsive: true,
              }}
            ></TableCell>
            <TableCell
              sx={{
                tableCellResponsive: true,
              }}
            ></TableCell>
          </TableRow>
        </TableHead>

        <TableBody
          style={{
            backgroundColor: "#fff",
            maxHeight: "400px",
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar sizes="25" src={user.avatar}></Avatar>
              </TableCell>
              <TableCell
                sx={{
                  tableCellResponsive: true,
                }}
              >
                {user.id}
              </TableCell>
              <TableCell
                style={{ color: "#57bc90", fontWeight: "700" }}
                className="cursor-pointer underline font-semibold"
              >
                <a className="" href="#">
                  {user.first_name}
                </a>
              </TableCell>
              <TableCell
                sx={{
                  tableCellResponsive: true,
                }}
              >
                {user.email}{" "}
              </TableCell>
              <TableCell onClick={() => setOpen(true)}>
                <Button
                  style={{
                    backgroundColor: "#b0e1b7",
                    width: "110px",
                    color: "#2b9a3a",
                    fontWeight: "700",
                  }}
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell
                sx={{
                  tableCellResponsive: true,
                }}
              >
                <Button
                  // onClick={() => setOpenDeleteModal(true)}
                  onClick={() => handleDelete(user.id)}
                  style={{
                    backgroundColor: "#ef9999",
                    width: "110px",
                    color: "#dd2525",
                    fontWeight: "700",
                  }}
                >
                  delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      

      {/* Edit Customer Modal */}
      <CustomModal isVisible={open} onClose={() => setOpen(false)}>
        <div className="bg-white center-content rounded-xl">
          <div
            className="customerContainer mt-2"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              className="text-center text-white"
            >
              Edit Customer
            </Typography>
          </div>
          <div className="flex flex-col p-7 gap-5">
            <TextField
              label="Customer Name"
              variant="outlined"
              className="p-5"
              value={selectedUser ? selectedUser.first_name : ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, first_name: e.target.value })
              }
            />
            <TextField
              label="Email"
              variant="outlined"
              className="green-background"
              value={selectedUser ? selectedUser.email : ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
          </div>
          <div className="ml-8">
           <TextField type="file" style={{ color: "#57bc90" }}
              className="underline font-semibold" onChange={(e) => handleAvatarChange(e)} />
          </div>
          <div className="add-customer-button p-6">
            {isLoading ? <FallingLines
              color="#4fa94d"
              width={100}
              visible={true}
              ariaLabel="falling-circles-loading"
            /> : (
              
            <Button
              className="w-full addCustomerBtn"
              variant="contained"
              color="primary"
              onClick={handleUpdate}>
              Edit Customer
            </Button>
          
)}
          </div>
        </div>
      </CustomModal>
      {/* edit modal end here */}
     
     
      {/* Delete Modal */}
      <CustomModal
        isVisible={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <div className="bg-white center-content rounded-xl">
          <div className="flex items-center justify-center flex-col gap-2">
            <img
              src={DeleteIcon}
              style={{ width: "80px" }}
              className="mt-10"
              alt=""
            />
            <Typography className="text-black font-black mt-2" variant="h5">
              Are You Sure?
            </Typography>
            <Typography className="text-black ">
              Do You Want To Really Delete This Customer?
            </Typography>
            <Typography className="text-center">
              This Process Can not be undone.
            </Typography>
          </div>
          <div className="flex justify-between space-x-4 p-10">
            <Button
              className="w-1/2 h-11"
              variant="contained"
              style={{ backgroundColor: "#a5a5af" }}
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-1/2"
              variant="contained"
              color="error"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
      {/* delete Modal end here */}
      </div>
  );
};

export default TableData;
