import React, { useState, useEffect } from "react";
import { message, Table, Button, Modal } from "antd";
import { Popup } from "antd-mobile";
import dayjs from "dayjs";

import { getResidueHeightByDOMRect } from "../../utils/utils";
import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import CountTop from "./components/CountTop";
import {
  getCount,
  getOutjsm,
  getOutjpay,
  getOutjpropay,
} from "../../api/count";
import { typeConfig } from "../../utils/columns";

import "./Count.less";

// 对接完毕

export default function Count() {
  const [loading, setLoading] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [height, setHeight] = useState(200);
  const [columns, setColumns] = useState([]);
  const [tableWidht, setTableWidht] = useState(0);
  const [scanShow, setScanShow] = useState(false);
  const [scanDetail, setScanDetail] = useState({}); //扫码详情
  const [fronsShow, setFronsShow] = useState(false);
  const [fronsItem, setFronsItem] = useState({}); //每个项目售后详情
  const [salesShow, setSalesShow] = useState(false); //售后
  const [salesItem, setSalesItem] = useState({}); //售后详情
  const [openShow, setOpenShow] = useState(false);
  const [openItem, setOpenItem] = useState({});
  const [state, setState] = useState({
    dateList: [new Date(), new Date()], //开始时间结束时间
    type: ["0"], //查询的type
    app_id: "", //
  });

  const changeState = (str, item) => {
    if (item) {
      if (!str) {
        return;
      }
      setState((data) => ({ ...data, [str]: item }));
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
  }, [JSON.stringify(state?.dateList), JSON.stringify(state?.type)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCountList = async (str) => {
    const { dateList, type } = state;
    const { columns, tableWidht } = typeConfig[type[0]] || {};
    if (type && type[0] === "0") {
      setColumns([
        ...columns,
        {
          title: "操作",
          render: (record) => (
            <Button type="primary" onClick={() => lookDetails(record)}>
              查看详情
            </Button>
          ),
        },
      ]);
    } else if (type && (type[0] === "2" || type[0] === "6")) {
      setColumns([
        ...columns,
        // {
        //   title: "操作",
        //   render: (record) => (
        //     <Button type="primary" onClick={() => countDetails(record)}>
        //       查看详情
        //     </Button>
        //   ),
        // },
      ]);
    } else if (type && type[0] === "3") {
      setColumns([
        ...columns,
        {
          title: "操作",
          render: (record) => (
            <Button type="primary" onClick={() => salesDetails(record)}>
              查看详情
            </Button>
          ),
        },
      ]);
    } else if (type && type[0] === "4") {
      setColumns([
        ...columns,
        {
          title: "操作",
          render: (record) => (
            <Button type="primary" onClick={() => openDetails(record)}>
              查看详情
            </Button>
          ),
        },
      ]);
    } else {
      setColumns([...columns]);
    }
    setTableWidht(tableWidht);
    setLoading(true);
    // let result = await getCount({
    //   start_time: str
    //     ? ""
    //     : dateList[0] && dayjs(dateList[0]).format("YYYY-MM-DD"),
    //   end_time: str
    //     ? ""
    //     : dateList[1] && dayjs(dateList[1]).format("YYYY-MM-DD"),
    //   type: type[0],
    //   app_id: str ? "" : state.app_id,
    // });
    const commonParams = {
      Stime: str ? "" : dateList[0] && dayjs(dateList[0]).format("YYYY-MM-DD"),
      Etime: str ? "" : dateList[1] && dayjs(dateList[1]).format("YYYY-MM-DD"),
    };
    try {
      let response;
      if (state.type[0] === "0") {
        response = await getOutjsm(commonParams);
        console.log("getOutjsm Response:", response);
      } else if (state.type[0] === "1") {
        response = await getOutjpay(commonParams);
        console.log("getOutjpay Response:", response);
      } else if (state.type[0] === "2") {
        response = await getOutjpropay({ ...commonParams, Type: "1" });
        console.log("getOutjpropay Type 1 Response:", response);
      } else if (state.type[0] === "6") {
        response = await getOutjpropay({ ...commonParams, Type: "2" });
        console.log("getOutjpropay Type 2 Response:", response);
      } else {
        console.warn("无效的 state.type 值:", state.type);
      }
      const { code, data, msg } = response || {};
      console.log(response, state.type, "state.type");
      message.destroy();
      if (code) {
        setTableList([...data]);
      } else {
        message.error(msg);
      }
    } catch (error) {
      console.error("接口调用出错:", error);
    }
    // const { code, data, msg } = result || {};
    // message.destroy();
    // if (code === 200) {
    //   if (data && data.length > 0) {
    //     setTableList([...data]);
    //   } else {
    //     setTableList([]);
    //   }
    // } else {
    //   message.error(msg);
    // }
    setLoading(false);
  };

  const lookDetails = (record) => {
    setScanDetail({ ...record });
    setScanShow(true);
  };

  const countDetails = (record) => {
    setFronsItem({ ...record });
    setFronsShow(true);
  };

  const salesDetails = (record) => {
    setSalesItem({ ...record });
    setSalesShow(true);
  };

  const openDetails = (record) => {
    setOpenItem({ ...record });
    setOpenShow(true);
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
              {dayjs(state?.dateList[0]).format("YYYY年MM月DD日")}-
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
              <Modal
                title={scanDetail?.app_name || null}
                open={scanShow}
                onCancel={() => {
                  setScanShow(false);
                  setScanDetail({});
                }}
                footer={null}
              >
                <Table
                  scroll={{
                    y: 300,
                  }}
                  rowKey={(record, i) => i}
                  pagination={false}
                  columns={[
                    {
                      title: "账号",
                      dataIndex: "Device_account",
                      className: "replace-color",
                    },
                  ]}
                  dataSource={scanDetail?.Device_data}
                />
              </Modal>
              <Modal
                title={fronsItem?.app_name || null}
                open={fronsShow}
                width={300}
                onCancel={() => {
                  setFronsShow(false);
                  setFronsItem({});
                }}
                footer={null}
              >
                <Table
                  scroll={{
                    y: 500,
                  }}
                  rowKey={(record) => Math.random()}
                  pagination={false}
                  columns={[
                    {
                      title: "套餐",
                      dataIndex: "package_name",
                      className: "replace-color",
                      render: (record) => <span>{record ? record : "--"}</span>,
                    },
                    {
                      title: "数量",
                      dataIndex: "Num",
                      className: "replace-color",
                      render: (record) => <span>{record ? record : "--"}</span>,
                    },
                    {
                      title: "金额",
                      dataIndex: "Amount",
                      className: "replace-color",
                      render: (record) => <span>{record ? record : "--"}</span>,
                    },
                  ]}
                  dataSource={fronsItem?.package_name_list}
                />
              </Modal>
              <Popup
                visible={salesShow}
                destroyOnClose={true}
                showCloseButton
                onClose={() => {
                  setSalesShow({});
                  setSalesShow(false);
                }}
                position="right"
                bodyStyle={{ width: "100%" }}
              >
                <div style={{ overflowX: "auto", padding: "0 16px" }}>
                  <div style={{ textAlign: "center", padding: "15px 0px" }}>
                    {salesItem?.account || "售后详情"}
                  </div>
                  <Table
                    scroll={{ x: "max-content" }} // 设置水平滚动
                    rowKey={() => Math.random()}
                    pagination={false}
                    columns={[
                      {
                        title: "订单ID",
                        dataIndex: "order_id",
                        className: "replace-color",
                        width: 300,
                        render: (record) => (
                          <div>
                            {record &&
                              record.map((item, index) => {
                                return <div key={index}>{item}</div>;
                              })}
                          </div>
                        ),
                      },
                      {
                        title: "项目名",
                        dataIndex: "app_name",
                        className: "replace-color",
                      },
                      {
                        title: "套餐名称",
                        dataIndex: "package_name",
                        className: "replace-color",
                        render: (record) => (
                          <span>{record ? record : "--"}</span>
                        ),
                      },
                      {
                        title: "售后金额",
                        dataIndex: "amount",
                        className: "replace-color",
                        render: (record) => (
                          <span>{record ? record : "--"}</span>
                        ),
                      },
                      {
                        title: "售后日期",
                        dataIndex: "date",
                        className: "replace-color",
                        render: (record) => (
                          <span>{record ? record : "--"}</span>
                        ),
                      },
                    ]}
                    dataSource={salesItem?.data}
                  />
                </div>
              </Popup>
              <Popup
                visible={openShow}
                destroyOnClose={true}
                showCloseButton
                onClose={() => {
                  setOpenItem({});
                  setOpenShow(false);
                }}
                position="left"
                bodyStyle={{ width: "100%" }}
              >
                <div style={{ overflowX: "auto", padding: "0 16px" }}>
                  <div style={{ textAlign: "center", padding: "15px 0px" }}>
                    {openItem?.account || "售后详情"}
                  </div>
                  <Table
                    scroll={{ x: "max-content" }} // 设置水平滚动
                    rowKey={() => Math.random()}
                    pagination={false}
                    columns={[
                      {
                        title: "项目名称",
                        dataIndex: "name",
                        className: "replace-color",
                      },
                      {
                        title: "金额",
                        dataIndex: "money",
                        className: "replace-color",
                      },
                      {
                        title: "任务数量",
                        dataIndex: "num",
                        className: "replace-color",
                      },
                      {
                        title: "成功数量",
                        dataIndex: "requests_num",
                        className: "replace-color",
                      },
                      {
                        title: "时间",
                        dataIndex: "create_time",
                        width: 160,
                        className: "replace-color",
                      },
                    ]}
                    dataSource={openItem?.data}
                  />
                </div>
              </Popup>
            </div>
          </div>
        }
      />
    </>
  );
}
