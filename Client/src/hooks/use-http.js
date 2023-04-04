import { useState, useCallback } from 'react';

const useHttp = () => {
  // State kiểm tra trạng thái loadding và error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //--- Sử dụng async await
  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);

    try {
      // requestConfig: Nhận {} để xử lý dữ liệu fetch
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        credentials: 'include',
      });

      // Nếu gặp lỗi thả ra lỗi
      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();

      // applyData: Nhận function để xử lý dữ liệu
      applyData(data);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []);

  // Trả về trị sau khi chạy xog
  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
