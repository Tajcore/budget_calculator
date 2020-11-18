import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (initUrl) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  useEffect(() => {
    let ignore = false;
    const fetchFromAPI = async () => {
      try {
        setLoading(true);
        const response = await axios(initUrl);
        if (!ignore) setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFromAPI();
    return () => {
      ignore = true;
    };
  }, [initUrl]);
  return { data, loading, error };
};

export default useFetch;
