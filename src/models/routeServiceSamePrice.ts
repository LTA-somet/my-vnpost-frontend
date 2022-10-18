import { useCallback, useState, useEffect } from 'react';
export default () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  return {
    isLoading,
  };
};
