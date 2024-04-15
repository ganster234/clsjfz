import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popup } from "antd-mobile";
import { message, Modal } from "antd";
import useAppStore from "../../../store";

import AddOpen from "./AddOpen";
import AddCk from "./AddCk";
import Trustship from "./Trustship";

import "./MorePopup.less";

export default function MorePopup() {
  const navigate = useNavigate();
  const [openVisible, setOpenVisible] = useState(false);
  const [ckVisible, setCkVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = useAppStore((state) => state.role); //用户信息
  const moreList = [
    // {
    //   title: "需求发布",
    //   icon: require("../../../assets/image/home/more/demand-release.png"),
    //   path: "/mobile/demand",
    //   roles: ["admin", "role", "superAdmin"],
    // },
    {
      title: "发布公告",
      icon: require("../../../assets/image/home/more/release-notice.png"),
      path: "/mobile/notice",
      roles: ["admin", "superAdmin"],
    },
    {
      title: "创建open",
      icon: require("../../../assets/image/home/more/open.png"),
      path: "open",
      roles: ["admin", "role", "superAdmin"],
    },
    {
      title: "创建CK",
      icon: require("../../../assets/image/home/more/ck.png"),
      path: "ck",
      roles: ["admin", "role", "superAdmin"],
    },
    // {
    //   title: "账号托管",
    //   icon: require("../../../assets/image/home/more/tutelage.png"),
    //   path: "", //trustship
    // },
  ];
  const jump = (path) => {
    message.destroy();
    if (!path) {
      return message.error("暂无访问权限");
    }
    if (path === "open") {
      return setOpenVisible(true);
    }
    if (path === "ck") {
      return setCkVisible(true);
    }
    if (path === "trustship") {
      return setIsModalOpen(true);
    }
    navigate(path);
  };
  const closePopup = (str) => {
    if (str === "open") {
      setOpenVisible(false);
    } else if (str === "ck") {
      setCkVisible(false);
    } else if (str === "trustship") {
      setIsModalOpen(false);
    }
  };
  return (
    <div className="more-popup">
      {moreList &&
        moreList.map((item) => {
          return item.roles?.includes(role) ? (
            <div
              key={item.title}
              className="more-popup-item"
              onClick={() => jump(item?.path)}
            >
              <img src={item.icon} alt="" className="more-popup-item-icon" />
              <span>{item.title}</span>
            </div>
          ) : (
            ""
          );
        })}
      <Popup
        visible={openVisible}
        onMaskClick={() => {
          setOpenVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          minHeight: "358px",
        }}
      >
        <AddOpen closePopup={closePopup} />
      </Popup>
      <Popup
        visible={ckVisible}
        onMaskClick={() => {
          setCkVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          minHeight: "411px",
        }}
      >
        <AddCk closePopup={closePopup} />
      </Popup>
      <Modal
        title={null}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose={true}
        closeIcon={null}
        width={276}
      >
        <Trustship closePopup={closePopup} />
      </Modal>
    </div>
  );
}
