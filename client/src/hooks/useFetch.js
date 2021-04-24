import React from "react";

export function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url]);

  return {
    loading,
    data,
    error,
  };
}
