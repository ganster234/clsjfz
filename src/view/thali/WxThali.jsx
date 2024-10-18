/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { message, Input, Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

import { getThaliList } from "../../api/thali";
import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import AddThali from "./components/AddThali";

import "./Thali.less";

// 套餐
export default function Thali() {
  const location = useLocation();
  const [thaliList, setThaliList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [thaliAddModal, setThaliAddModal] = useState(false);
  const [thaliLoading, setThaliLoading] = useState(false);
  const setThaliInfo = useAppStore((state) => state.setState);
  const navigate = useNavigate();
  const whetherAPP =
    location.pathname === "/mobile/wethali"
      ? { Web: 0, App: 1 }
      : { Web: 1, App: 0 };
  // useEffect(() => {
  //   if (thaliList && thaliList.length <= 0) {
  //     getList();
  //   }
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    getList(whetherAPP);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (val) => {
    setThaliLoading(true);
    let result = await getThaliList({
      Pagenum: "1",
      Pagesize: "1000",
      Type: 2,
      ...val,
    });
    const { code, data, msg } = result || {};
    message.destroy();
    if (code) {
      if (data && data.length > 0) {
        setThaliList([...data]);
      }
    } else {
      message.error(msg);
    }
    setThaliLoading(false);
  };

  //筛选过滤
  const screenList = useMemo(() => {
    if (!searchValue) {
      return thaliList;
    }
    return thaliList.filter((element) =>
      element.Device_name?.includes(searchValue)
    );
  }, [searchValue, thaliList]);

  const closeModal = (data) => {
    setThaliAddModal(data);
  };

  const jumpProjectDetail = (data) => {
    setThaliInfo(data, "thaliInfo");
    navigate(`/mobile/wethali/config?data=${JSON.stringify(whetherAPP)}`);
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="thali-top">
            <img
              src={require("../../assets/image/thali/thali-back.png")}
              alt=""
              className="thali-back-icon"
              onClick={() => navigate(-1)}
            />
            <Input
              className="thali-search-input"
              placeholder="搜索项目或类型"
              value={searchValue}
              bordered={false}
              onChange={(even) => {
                setSearchValue(even.target.value);
              }}
              prefix={<SearchOutlined />}
            />
            {/* <span
              className="thali-add-btn"
              onClick={() => setThaliAddModal(true)}
            >
              <img
                src={require("../../assets/image/thali/add-thali.png")}
                alt=""
                className="add-thali-icon"
              />
              <span>添加</span>
            </span> */}
          </div>
        }
        content={
          <div className="thali-content">
            <Spin spinning={thaliLoading}>
              {screenList &&
                screenList.map((item) => {
                  return (
                    <div className="thali-item" key={item?.Device_Sid}>
                      <img
                        src={item?.Device_url}
                        alt=""
                        className="thali-item-icon"
                      />
                      <span className="thali-item-content">
                        <div>
                          <div className="thali-item-title">
                            {item?.Device_name}
                          </div>
                          <div className="thali-item-inventory">
                            库存:{item?.Device_kc}
                          </div>
                        </div>
                        <div className="thali-item-price">
                          <span className="thali-item-price-icon">￥</span>
                          {item?.Device_money}
                        </div>
                      </span>
                      <span
                        className="thali-item-details-btn"
                        onClick={() => jumpProjectDetail(item)}
                      >
                        查看详情
                      </span>
                    </div>
                  );
                })}
            </Spin>
            <Modal
              title={null}
              closeIcon={null}
              footer={null}
              open={thaliAddModal}
              width={320}
              destroyOnClose
              onCancel={() => setThaliAddModal(false)}
            >
              <AddThali closeModal={closeModal} getList={getList} />
            </Modal>
          </div>
        }
      />
    </>
  );
}
