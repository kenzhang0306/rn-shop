import { useState } from "react";

export default function useFetch() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData(url) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Loading data fail");
      }
      const data = await res.json();
      setData(data.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }
  return { data, loading, error, fetchData };
}
