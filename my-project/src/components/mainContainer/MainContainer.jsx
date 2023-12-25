// --------------------          IMPORT Statement      -------------------------------------------// 
import React, { useState, useEffect } from "react";
import "./MainContainer.css";
import TableData from "../TableData";
import CustomModal from "../modal/CustomModal";
import { TextField, Button, Typography, FormControl } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../../features/customer/CustomerSlice";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../../firebase/firebaseConfig.js";
import { FallingLines } from "react-loader-spinner";
import Swal from 'sweetalert2'
import {customerEditSuccessFully,swalErrorCustomerAdding} from '../../constants/SwallFire.js'
// ------------------         MainContainer     -----------------------------------------------------//       
const MainContainer = () => {

  // ---------------    State Mangement      --------------------------------------------------//
  const [open, setOpen] = useState(false);
  const [student, addStudent] = useState(false);
  const [first_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const [avatar, setImageAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const todos = useSelector((state) => state.todos);

 

  //-----------       Image Upload Logic here With The Help of Firebase    -------------------------
  const imageUpload = () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      return new Promise((resolve, reject) => {
        setIsLoading(true);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
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


  useEffect(() => {
    uploadImageAndDispatch();
  }, []);

  const uploadImageAndDispatch = async () => {
    try {
      const downloadURL = await imageUpload();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("customerTodos"));
      if (data) dispatch(addTodo(data));
    } catch (error) {
      console.error("Error loading data from local storage:", error);
    }
  }, [dispatch]);

  const addTodoHandler = async (e) => {
    setIsLoading(true);

    try {
      const downloadURL = await imageUpload();
      const newCustomer = { first_name, email, avatar: downloadURL };
      dispatch(addTodo(newCustomer));
      console.log(first_name, email, avatar);
      setName("");
      setEmail("");
      customerEditSuccessFully()
      setOpen(false)
    } catch (error) {
      console.error("Error uploading image or adding todo:", error);
      swalErrorCustomerAdding(error)
    } finally {
      setIsLoading(false);
      swalErrorCustomerAdding(error)
    }
  };


// -------------------         Swall Success And Error   -----------------------------------------//




  return (
    <div style={{ backgroundColor: "#f3f3f3", width: "100%" }}>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "15px",
          boxShadow: "0px 0px px 0px #fff ",
        }}
      >
        <h2 className="ml-10 mt-4 text-3xl font-semibold">CUSTOMERS</h2>
      </div>
      <div
        onClick={() => setOpen(true)}
        className="custom-button cursor-pointer"
      >
        <span className="custom-button-span">+</span>
        <p className="custom-button-text">Add New Student</p>
      </div>

      <div className="mt-5">
        <TableData />
      </div>
      <CustomModal isVisible={open} onClose={() => setOpen(false)} />

      <CustomModal isVisible={open} onClose={() => setOpen(false)}>
        <div className="bg-white center-content rounded-xl">
          <div
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
            className="customerContainer mt-2"
          >
            <Typography
              variant="h5"
              component="h2"
              className="text-center text-white"
            >
              Add New Customer
            </Typography>
          </div>
          <div className="flex flex-col p-7 gap-5">
            <FormControl className="gap-8">
              <TextField
                label="Customer Name"
                variant="outlined"
                className="p-5"
                value={first_name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Email"
                variant="outlined"
                className="green-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="ml-8">
            <TextField
              type="file"
              onClick={imageUpload}
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          {
          
          isLoading ? (
            <FallingLines
              color="#4fa94d"
              width={100}
              visible={true}
              ariaLabel="falling-circles-loading"
            />
          ) 
          
          : (
            <div className="add-customer-button  p-6">
              <Button
                onClick={addTodoHandler}
                className="w-full addCustomerBtn"
                variant="contained"
                color="primary"
              >
                Add Customer
              </Button>
            </div>
          )}
        </div>
      </CustomModal>
    </div>
  );
};

export default MainContainer;
