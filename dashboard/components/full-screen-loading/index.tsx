import React from "react";
import "./style.css";

const FullScreenLoading = () => {
  return (
    <div className="loading-background">
      <div className="loading-bar">
        <div className="loading-circle-1" />
        <div className="loading-circle-2" />
      </div>
    </div>
  );
};

export default FullScreenLoading;
