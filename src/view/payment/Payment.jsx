import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, message } from "antd";
import { Calendar, Popup } from "antd-mobile";
import dayjs from "dayjs";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { getPayList } from "../../api/pay";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { payColumns } from "../../utils/columns";

import "./Payment.less";
import "../../assets/css/Calendar.less";

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [datePayShow, setDatePayShow] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [aggregate, setaggregate] = useState(0); //总计
  const [dataList, setDataList] = useState([]);
  const [height, setHeight] = useState(0);
  const [state, setState] = useState({
    dateList: [new Date(), new Date()], //时间
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    // 初始化获取数据
    getList();
  }, [JSON.stringify(tableParams), JSON.stringify(state)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async () => {
    const { current, pageSize } = tableParams.pagination;
    const { dateList } = state;
    setLoading(true);
    let result = await getPayList({
      start_time: dayjs(dateList[0] || new Date()).format("YYYY-MM-DD"),
      end_time: dayjs(dateList[1] || new Date()).format("YYYY-MM-DD"),
      page: current,
      limit: pageSize,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      setDataList([...data?.list.data]);
      setTotal(data?.list.total);
      setaggregate(data?.total);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="payment-top">
            <div className="payment-top-back-title">
              <img
                src={require("../../assets/image/back-icon.png")}
                alt=""
                className="payment-top-back"
                onClick={() => navigate(-1)}
              />
              支付记录
            </div>
            <div className="payment-top-screen">
              <span
                className="payment-top-screen-item"
                onClick={() => setDatePayShow(true)}
              >
                <span>选择时间</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="payment-screen-item-icon"
                />
              </span>
            </div>
          </div>
        }
        content={
          <div className="payment-content">
            <div className="payment-content-title">
              {dayjs(state?.dateList[0] || new Date()).format("YYYY年MM月DD日")}
              -
              {dayjs(state?.dateList[1] || new Date()).format("YYYY年MM月DD日")}
            </div>
            <div className="payment-content-main">
              <div className="payment-main-title">支付记录</div>
              <Table
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell className="bg-[#FAFAFA]" index={0}>
                        <p className=" text-[12px] ">
                          总计：<span>{aggregate}</span>
                        </p>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                scroll={{
                  x: 1500,
                  y: height,
                }}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{
                  ...tableParams.pagination,
                  total: total,
                  hideOnSinglePage: false,
                  showSizeChanger: true,
                }}
                onChange={handleTableChange}
                columns={[...payColumns]}
                dataSource={dataList}
              />
            </div>
            <Popup
              visible={datePayShow}
              destroyOnClose={true}
              onMaskClick={() => {
                setDatePayShow(false);
              }}
              onClose={() => {
                setDatePayShow(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "40vh",
              }}
            >
              <div style={{ padding: "12px" }}>
                <Calendar
                  className="calendar-custom"
                  defaultValue={state?.dateList}
                  selectionMode="range"
                  onChange={(even) => {
                    if (even) {
                      setState((item) => ({ ...item, dateList: even }));
                    }
                  }}
                />
              </div>
            </Popup>
          </div>
        }
      />
    </>
  );
}
