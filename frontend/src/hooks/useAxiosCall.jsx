import { useState } from "react";

function useAxiosCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args); // Call the API service function
      return response?.data?.data; // Return the response data for further use
    } catch (error) {
      setError(error?.response?.data);
      // console.log(error?.response?.data);
      throw error; // Re-throw the error for the component to handle
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchData };
}

export {useAxiosCall} 
