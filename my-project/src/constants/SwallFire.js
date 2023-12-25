import Swal from "sweetalert2";

export const swalSuccess = () => {
    Swal.fire({
      title: "Success",
      text: "Customer added successfully",
      icon: "success",
    });
  };


export const swalError = () => {
  Swal.fire({
    title: "Error",
    text: "Adding Customer failed",
    icon: "error",
  });
};

  export const swallApi = ()=>{
    Swal.fire({
        title: "Error",
        text: "API endpoint not found. Please check the URL.",
        icon: "error",
      });
  }

  export const swallInternalServer = ()=>{
    Swal.fire({
        title: "Error",
        text: "Internal server error. Please try again later.",
        icon: "error",
      });
  }
  export const swallApiFailed = ()=>{
    Swal.fire({
        title: "Error",
        text: "API call failed",
        icon: "error",
      });
  }

  export const swallNoResponse = () => {
    Swal.fire({
      title: "Error",
      text: "No response received from the server.",
      icon: "error",
    });
  };

  export const swallRequestSetupError = (errorMessage) => {
    Swal.fire({
      title: "Error",
      text: `Error processing the request: ${errorMessage}`,
      icon: "error",
    });
  };
  

 export const editSuccesFull = ()=>{
    Swal.fire({
      title: "Success",
      text: "Customer Edit successfully",
      icon: "success",
    });
  }

export  const editFailed = ()=>{
    Swal.fire({
      title: error.message,
      text: "Edit Failed",
      icon: "error",
    });
  }


export const customerEditSuccessFully = () =>{
    Swal.fire({
      title: "Success",
      text: "Customer Add successful, Reload The Page",
      icon: "success",
    });
  }


  export const swalErrorCustomerAdding = (error)=>{
    Swal.fire({
      title: "Error",
      text: `Error processing the request: ${error}`,
      icon: "error",
    });
  }
  