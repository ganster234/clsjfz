import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Popup } from "antd-mobile";
import { Radio, Table } from "antd";
import useAppStore from "../../store";
// import { context } from "../../components/AppProvider";

import RecordStat from "./components/RecordStat";
import TradingPost from "./components/TradingPost";
import Ability from "./components/Ability"; //最后对接
import System from "./components/System";
import MenuPopup from "./components/MenuPopup";
import MorePopup from "./components/MorePopup";
import { getDayStati, getIndexDay } from "../../api/home";
import { getDealList } from "../../api/deal";

import "./Home.less";

export default function Home() {
  // const navigate = useNavigate();
  const role = useAppStore((state) => state.role); //用户信息
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const userInfo = useAppStore((state) => state.userInfo); //用户信息
  const [channelDetail, setChannelDetail] = useState({}); //销售额
  const [dealList, setDealList] = useState([]); //公开交易站
  const [countList, setCountList] = useState([]); //销售数据
  const [todayMonth, setTodayMonth] = useState("today");
  useEffect(() => {
    const getChannel = async () => {
      let result = await getDayStati({
        type: "today",
      });
      if (result?.code === 200) {
        setChannelDetail({ ...result?.data });
      }
    };
    // 获取交易站的数据
    const getDeal = async () => {
      let result = await getDealList({
        limit: "1",
      });
      const { code, data } = result || {};
      if (code === 200) {
        setDealList([...data?.data]);
      }
    };
    getDeal();
    getChannel();
  }, []);

  useEffect(() => {
    if (role === "superAdmin" || role === "admin") {
      getCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(todayMonth)]);

  const getCount = async () => {
    let result = await getIndexDay({ type: todayMonth });
    console.log(result, "result");
    if (result?.code === 200) {
      setCountList([...result?.data]);
    }
  };

  const menuChange = (data) => {
    setVisiblePopup(data);
  };

  return (
    <div className="home">
      <div className="home-header">
        <img
          src={require("../../assets/image/home/header/menu-icon.png")}
          alt=""
          className="home-header-icon pointer"
          onClick={() => setVisiblePopup(true)}
        />
        <div className="home-header-right-icon">
           {/* <img
            src={require("../../assets/image/home/header/message-icon.png")}
            alt=""
            className="home-header-icon pointer"
          />  */}
          <img
            src={require("../../assets/image/home/header/add-icon.png")}
            alt=""
            className="home-header-icon home-header-icon-left pointer"
            onClick={() => setMoreVisible(true)}
          />
        </div>
      </div>
      <div className="home-user-info">
        <img
          src={require("../../assets/image/avater/head-icon.png")}
          alt=""
          className="user-avater"
        />
        <div className="user-info-name">{userInfo?.account}</div>
        {/* <div
          className="home-user-cash"
          onClick={() => navigate("/mobile/launch/cash")}
        >
          提现
        </div> */}
      </div>
      <div className="amount-money">
        <div className="amount-item">
          <div className="amount-balance-income">{userInfo?.balance}</div>
          <div className="amount-title">可用金额</div>
        </div>
        <div className="amount-item">
          <div className="amount-balance-income">{userInfo?.income}</div>
          <div className="amount-title">冻结金额</div>
        </div>
      </div>
      {/* 数据统计 */}
      {role && (role === "superAdmin" || role === "admin") && (
        <RecordStat channelDetail={channelDetail} />
      )}
      {/* 销售数据表格 */}
      {role && (role === "superAdmin" || role === "admin") && (
        <div className="sales-data-table">
          <div className="sales-data-table-title">
            <Radio.Group
              name="radiogroup"
              value={todayMonth}
              onChange={(even) => {
                setTodayMonth(even.target.value);
              }}
            >
              <Radio value={"today"}>日统计</Radio>
              <Radio value={"month"}>月统计</Radio>
            </Radio.Group>
          </div>
          <Table
            scroll={{
              y: 215,
              x: 445,
            }}
            rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
            rowKey={(record) => record?.time}
            pagination={false}
            columns={[
              {
                title: "时间",
                dataIndex: "time",
              },
              // {
              //   title: "总充值额",
              //   dataIndex: "all_money",
              // },
              {
                title: "充值金额",
                dataIndex: "pay_money",
              },
              {
                title: "销售额",
                dataIndex: "money",
              },
              {
                title: "退款金额",
                dataIndex: "tui_money",
              },
            ]}
            dataSource={countList && countList.reverse()}
          />
        </div>
      )}
      {/* 公开交易站 */}
      {dealList && dealList.length > 0 && <TradingPost dealList={dealList} />}
      {/* 常用功能，最后做 */}
      <Ability />
      {/* 系统下载 */}
      <System />
      {/* menu侧边栏 */}
      <Popup
        visible={visiblePopup}
        onMaskClick={() => {
          setVisiblePopup(false);
        }}
        position="left"
        bodyStyle={{ width: "315px" }}
      >
        <MenuPopup menuChange={menuChange} />
      </Popup>
      <Popup
        visible={moreVisible}
        onMaskClick={() => {
          setMoreVisible(false);
        }}
        onClose={() => {
          setMoreVisible(false);
        }}
        bodyStyle={{ height: "100%" }}
        showCloseButton
      >
        <MorePopup />
      </Popup>
    </div>
  );
}
