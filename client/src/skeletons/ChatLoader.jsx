import React from "react";

const MessageSkeleton = () => {
  return (
    <>
      <div className="message-row">
        <div className="skeleton avatar"></div>
        <div className="message-content">
          <div className="skeleton text-line"></div>
          <div className="skeleton text-line"></div>
        </div>
      </div>
      <div className="message-row message-row-end">
        <div className="message-content">
          <div className="skeleton text-line"></div>
        </div>
        <div className="skeleton avatar"></div>
      </div>
      <div className="message-row">
        <div className="skeleton avatar"></div>
        <div className="message-content">
          <div className="skeleton text-line"></div>
          <div className="skeleton text-line"></div>
        </div>
      </div>
      <div className="message-row message-row-end">
        <div className="message-content">
          <div className="skeleton text-line"></div>
        </div>
        <div className="skeleton avatar"></div>
      </div>
      <div className="message-row">
        <div className="skeleton avatar"></div>
        <div className="message-content">
          <div className="skeleton text-line"></div>
          <div className="skeleton text-line"></div>
        </div>
      </div>
      <div className="message-row message-row-end">
        <div className="message-content">
          <div className="skeleton text-line"></div>
        </div>
        <div className="skeleton avatar"></div>
      </div>
    </>
  );
};

export default MessageSkeleton;
