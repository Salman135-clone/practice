import React, { useEffect } from "react";

import { useLocation } from "react-router-dom";

const VerifyPage = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oobCode = params.get("oobCode");

    if (!oobCode) {
      alert(oobCode);
    }
  }, [location]);
  return (
    <>
      <div classname="red">Verify Page</div>
    </>
  );
};

export default VerifyPage;
