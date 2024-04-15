import React, { useState, useEffect } from "react";
import { message, Table } from "antd";

import dayjs from "dayjs";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import CountTop from "./components/CountTop";
import { salesStatistics } from "../../api/count";

import "./Count.less";

// 对接完毕

export default function Count() {
  const [loading, setLoading] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [height, setHeight] = useState(200);
  const [columns, setColumns] = useState([]);
  const [tableWidht, setTableWidht] = useState(0);

  const [state, setState] = useState({
    dateList: [new Date(), new Date()], //开始时间结束时间
  });

  const changeState = (str, item) => {
    if (item) {
      if (!str) {
        return;
      }
      setState((data) => ({
        ...data,
        [str]: [
          dayjs(item[0]).format("YYYY-MM-DD"),
          dayjs(item[1]).format("YYYY-MM-DD"),
        ],
      }));
    } else {
      setState((data) => ({
        ...data,
        [str]: [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")],
      }));
    }
  };

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect() + 40);
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect() + 40);
    };
    getCountList();
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCountList = async (str) => {
    const { dateList, type } = state;
    const columns = [
      {
        title: "代理账号",
        dataIndex: "account",
      },
      {
        title: "充值金额",
        dataIndex: "chong",
      },
      {
        title: "邀请用户数",
        dataIndex: "num",
      },
    ];
    const tableWidht = 800;
    setColumns([...columns]);
    setTableWidht(tableWidht);
    setLoading(true);
    let result = await salesStatistics({
      start_time: str
        ? ""
        : dateList[0] && dayjs(dateList[0]).format("YYYY-MM-DD"),
      end_time: str
        ? ""
        : dateList[1] && dayjs(dateList[1]).format("YYYY-MM-DD"),
    });
    const { code, data, msg } = result || {};
    message.destroy();
    if (code === 200) {
      if (data && data.length > 0) {
        setTableList([...data]);
      } else {
        setTableList([]);
      }
    } else {
      message.error(msg);
    }
    setLoading(false);
  };
  return (
    <>
      <LayoutPanel
        top={
          <CountTop
            data={state}
            changeState={changeState}
            getCountList={getCountList}
          />
        }
        content={
          <div className="count-content">
            <div className="count-title-date">
              {dayjs(state?.dateList[0]).format("YYYY年MM月DD日")} -
              {dayjs(state?.dateList[1]).format("YYYY年MM月DD日")}
            </div>
            <div className="count-table">
              {/* <div className="count-table-title">渠道销售额明细</div> */}
              <Table
                scroll={{
                  x: tableWidht,
                  y: height,
                }}
                loading={loading}
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                rowKey={() => Math.random()}
                columns={columns}
                pagination={false}
                dataSource={tableList}
              />
            </div>
          </div>
        }
      />
    </>
  );
}
