import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, message, Popconfirm } from "antd";
import { Popup, Button, Input } from "antd-mobile";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { processColumns } from "../../utils/columns";
import { getUsdtList, setUpdate } from "../../api/process";

import "./Process.less";
import "../../assets/css/Calendar.less";

export default function Process() {
  const navigate = useNavigate();
  let bgColor = {
    0: "#2773F2",
    1: "#25E692",
    2: "#E62525",
  };
  let statusTest = {
    0: "申请中",
    1: "已同意",
    2: "已拒绝",
  };
  const [loading, setLoading] = useState(false);
  const [processShow, setProcessShow] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [height, setHeight] = useState(0);
  const [state, setState] = useState({
    account: "", //用户名
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
    // 初始化数据包括后续更新
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    const { account } = state;
    setLoading(true);
    let result = await getUsdtList({
      account: str ? "" : account,
      page: str ? 1 : current,
      limit: str ? 10 : pageSize,
      status: -1,
    });
    const { code, msg, data } = result || {};
    if (code === 200) {
      setDataList([...data?.data]);
      setTotal(data?.total);
    } else {
      message.destroy();
      message.error(msg);
    }
    setLoading(false);
  };

  const agreeWithRefuse = async (record, str) => {
    let param = {
      id: record.id,
      status: str ? 1 : 2,
    };
    message.destroy();
    let result = await setUpdate(param);
    if (result?.code === 200) {
      message.success("操作成功");
      getList();
    } else {
      message.error(result?.msg);
    }
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };

  const reset = () => {
    const { pagination } = tableParams;
    if (pagination.current === 1 && pagination.pageSize === 10) {
      setState((item) => ({ ...item, account: "" }));
      getList("reset");
      setProcessShow(false);
    } else {
      setTableParams({
        pagination: {
          current: 1, //当前页码
          pageSize: 10, // 每页数据条数
        },
      });
    }
  };

  const query = () => {
    const { pagination } = tableParams;
    if (pagination.current === 1 && pagination.pageSize === 10) {
      getList();
      setProcessShow(false);
    } else {
      setTableParams({
        pagination: {
          current: 1, //当前页码
          pageSize: 10, // 每页数据条数
        },
      });
    }
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="process-top">
            <div className="process-top-back-title">
              <span className="process-top-back-box">
                <img
                  src={require("../../assets/image/back-icon.png")}
                  alt=""
                  className="process-top-back"
                  onClick={() => navigate(-1)}
                />
              </span>
              USDT管理
            </div>
            <div className="process-top-screen">
              <span
                className="process-top-screen-item"
                onClick={() => setProcessShow(true)}
              >
                <span>用户名称</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="process-screen-item-icon"
                />
              </span>
            </div>
          </div>
        }
        content={
          <div className="process-content">
            <div className="process-content-main">
              <div className="process-main-title">USDT管理</div>
              <Table
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                scroll={{
                  x: 1000,
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
                columns={[
                  ...processColumns,
                  {
                    title: "审核状态",
                    dataIndex: "status",
                    render: (record) => (
                      <div className="process-table-status">
                        <span
                          className="process-status-round"
                          style={{ background: bgColor[record] || "" }}
                        ></span>
                        <span>{statusTest[record] || "--"}</span>
                      </div>
                    ),
                  },
                  {
                    title: "操作",
                    width: 200,
                    render: (record) => (
                      <div className="process-record-status">
                        {record.status === 0 && (
                          <>
                            <Popconfirm
                              title="提示"
                              description="确认要通过吗?"
                              onConfirm={() => agreeWithRefuse(record, "with")}
                              okText="通过"
                              cancelText="取消"
                            >
                              <span className="process-agree-with">
                                确定到账
                              </span>
                            </Popconfirm>
                            <Popconfirm
                              title="提示"
                              description="确认要拒绝吗?"
                              onConfirm={() => agreeWithRefuse(record)}
                              okText="拒绝"
                              cancelText="取消"
                            >
                              <span className="process-refuse">拒绝</span>
                            </Popconfirm>
                          </>
                        )}
                        {record.status !== 0 && "--"}
                      </div>
                    ),
                  },
                ]}
                dataSource={dataList}
              />
            </div>
            <Popup
              visible={processShow}
              destroyOnClose={true}
              onMaskClick={() => {
                setProcessShow(false);
              }}
              onClose={() => {
                setProcessShow(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "20vh",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button size="mini" onClick={() => reset()}>
                    重置
                  </Button>
                  <Button color="primary" size="mini" onClick={() => query()}>
                    查询
                  </Button>
                </div>
                <div className="process-input">
                  <Input
                    style={{
                      flex: 1,
                      "--placeholder-color": "#BFBFBF",
                      "--font-size": "16px",
                      "--color": "#666666",
                    }}
                    value={state?.account}
                    placeholder="请输入内容"
                    onChange={(even) =>
                      setState((item) => ({ ...item, account: even }))
                    }
                    clearable
                  />
                </div>
              </div>
            </Popup>
          </div>
        }
      />
    </>
  );
}