import {swallApi,swallApiFailed,swallInternalServer,swallNoResponse,swallRequestSetupError}  from './SwallFire.js'


export const handleFetchError = (error) => {
    if (error.response) {
      handleResponseError(error.response.status);
    } else if (error.request) {
      swallNoResponse();
    } else {
      swallRequestSetupError(error.message);
    }
  };
  
  export const handleResponseError = (status) => {
    switch (status) {
      case 404:
        swallApi();
        break;
      case 500:
        swallInternalServer();
        break;
      default:
        swallApiFailed();
    }
  };
  