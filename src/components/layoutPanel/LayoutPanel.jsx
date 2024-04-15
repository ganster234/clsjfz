import React from "react";

import './LayoutPanel.less'

export default function LayoutPanel({ top, content, bottom }) {
  return (
    <div className="layout-panel">
      <div className="layout-panel-top">{top}</div>
      <div className="layout-panel-content">{content}</div>
      <div className="layout-panel-bottom">{bottom}</div>
    </div>
  );
}
