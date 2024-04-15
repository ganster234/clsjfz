import React from "react";

import "./TradingPost.less";

export default function TradingPost({ dealList }) {
  return (
    <div className="trading-post">
      <span>公开交易站：</span>
      {dealList &&
        dealList.map((item, index) => {
          return (
            <div key={item.id} className="trading-post-main">
              <span className="trading-post-main-text">{item?.price_name}</span>
            </div>
          );
        })}
    </div>
  );
}
