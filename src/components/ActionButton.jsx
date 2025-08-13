import React from "react";
import { authProvider } from "../context/MyProvider";
import Tooltip from "@mui/material/Tooltip";

const ActionButton = ({
  permission,
  children,
  onClick,
  disabledColor,
  normalColor,
  defaultStyle,
  ...rest
}) => {
  const { hasPermission } = authProvider();
  const isAllowed = hasPermission(permission);
  const handleClick = () => {
    if (isAllowed) {
      onClick();
    }
  };
  return (
    <>
      {isAllowed ? (
        <button
          permission={permission}
          {...rest}
          onClick={handleClick}
          disabled={!isAllowed}
          className={`${defaultStyle} ${
            isAllowed ? normalColor : disabledColor
          }`}
        >
          {children}
        </button>
      ) : (
        <Tooltip
          title="You don't have permission to perform this action"
          followCursor
        >
          <span>
            <button
              permission={permission}
              {...rest}
              onClick={handleClick}
              disabled={!isAllowed}
              className={`${defaultStyle} ${
                isAllowed ? normalColor : disabledColor
              }`}
            >
              {children}
            </button>
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default ActionButton;
