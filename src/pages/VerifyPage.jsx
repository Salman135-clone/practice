import React, { useEffect } from "react";

import { useLocation } from "react-router-dom";

const VerifyPage = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oobCode = params.get("oobCode");

    if (oobCode) {
      alert("We have code: " + oobCode);
    }
  }, [location]);
  return (
    <>
      <div>Verify Page</div>
    </>
  );
};

export default VerifyPage;
