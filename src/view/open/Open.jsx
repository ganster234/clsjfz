/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Table, message } from "antd";
import { Popup, Calendar } from "antd-mobile";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import CreatePopup from "./components/CreatePopup";
import ExportPopup from "./components/ExportPopup";
import { getOpenList } from "../../api/open";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { openColumns } from "../../utils/columns";

import "./Open.less";
import "../../assets/css/Calendar.less";

export default function Open() {
  const navigate = useNavigate();
  const [height, setHeight] = useState(0);
  const [openLoading, setOpenLoading] = useState(false); //加载
  const [tableList, setTableList] = useState([]); //table数据
  const [total, setTotal] = useState(0); // 总条数
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const [dateOpen, setDateOpen] = useState(false); //时间
  const [createOpen, setCreateOpen] = useState(false); //创建open
  const [exportOpen, setExportOpen] = useState(false); //导出
  const Userid = sessionStorage.getItem("user");

  const [state, setState] = useState({
    dateList: [new Date(), new Date()], //开始时间结束时间
    name: "", //用户名称

    Sid: "", //任务编号
    Type: "1", //1op,2ck
  });

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getList();
  }, [JSON.stringify(tableParams), JSON.stringify(state)]);

  const getList = async () => {
    const { dateList, name, Type, Sid } = state;
    const { current, pageSize } = tableParams.pagination;
    let param = {
      // name: name,
      // is_op: "1",
      // page: current,
      // limit: pageSize,
      // start_time: dateList[0] && dayjs(dateList[0]).format("YYYY-MM-DD"),
      // end_time: dateList[1] && dayjs(dateList[1]).format("YYYY-MM-DD"),
      Sid, //任务sid
      Username: name, //用户名
      Userid, //用户sid
      Type, //1
      Lytype: "1", //q
      Stime: dateList[0] && dayjs(dateList[0]).format("YYYY-MM-DD"), //开始时间
      Etime: dateList[1] && dayjs(dateList[1]).format("YYYY-MM-DD"), //结束时间
      Pagenum: current, //页数
      Pagesize: pageSize, //一页多少
    };
    setOpenLoading(true);
    let result = await getOpenList(param);
    const { code, data, msg } = result || {};
    message.destroy();
    if (code) {
      // setTableList([...data?.data]);
      // setTotal(data?.total);
      setTableList([...data]);
      setTotal(Number(result.pagenum));
    } else {
      message.error(msg);
    }
    setOpenLoading(false);
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTableList([]);
    }
  };

  const closePopup = (data, str) => {
    setCreateOpen(data);
    if (str) {
      getList();
    }
  };
  const closeExportPopup = (data) => {
    setExportOpen(data);
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="open-top">
            <div className="open-input">
              <img
                src={require("../../assets/image/back-icon.png")}
                alt=""
                className="open-input-back"
                onClick={() => navigate(-1)}
              />
              <Input
                value={state?.name}
                className="open-top-input "
                placeholder="搜索用户名称"
                bordered={false}
                onChange={(even) => {
                  setState((item) => ({ ...item, name: even.target.value }));
                }}
                prefix={<SearchOutlined />}
              />
            </div>
            <div className="open-date-and-time">
              <span
                className="open-top-date-time"
                onClick={() => setDateOpen(true)}
              >
                选择时间
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="open-date-and-time-triangle"
                />
              </span>
              <span className="create-and-export">
                {/* <span
                  className="create-and-export-item"
                  onClick={() => setCreateOpen(true)}
                >
                  <img
                    src={require("../../assets/image/openck/create-icon.png")}
                    alt=""
                    className="create-export"
                  />
                  创建任务
                </span> */}
                <span
                  className="create-and-export-item"
                  onClick={() => setExportOpen(true)}
                >
                  <img
                    src={require("../../assets/image/openck/export-icon.png")}
                    alt=""
                    className="create-export"
                  />
                  导出
                </span>
              </span>
            </div>
          </div>
        }
        content={
          <div className="open-content">
            <div className="open-content-time">
              {dayjs(state?.dateList[0]).format("YYYY年MM月DD日")}-
              {dayjs(state?.dateList[1]).format("YYYY年MM月DD日")}
            </div>
            <div className="open-content-table-box">
              <div className="open-content-table-box-title">提取open</div>
              <Table
                scroll={{
                  x: 1500,
                  y: height,
                }}
                loading={openLoading}
                pagination={{
                  ...tableParams.pagination,
                  total: total,
                  hideOnSinglePage: false,
                  showSizeChanger: true,
                }}
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                rowKey={(record) => record?.openid_task_id}
                onChange={handleTableChange}
                columns={[
                  {
                    title: "创建时间",
                    dataIndex: "Device_time",
                  },
                  {
                    title: "用户名称",
                    dataIndex: "Device_user",
                  },
                  {
                    title: "任务编号",
                    width: 300,
                    dataIndex: "Device_Sid",
                    render: (record) => (
                      <span className="openid-task-id">{record}</span>
                    ),
                  },
                  ...openColumns,

                  {
                    title: "任务状态",
                    dataIndex: "Device_remark",
                    render: (record) => (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          className={
                            record
                              ? "open-task-status open-task-status-active"
                              : "open-task-status"
                          }
                        >
                          {record ? "已完成" : "进行中"}
                        </div>
                      </div>
                    ),
                  },
                ]}
                dataSource={tableList}
              />
            </div>
            <Popup
              visible={dateOpen}
              destroyOnClose={true}
              onMaskClick={() => {
                setDateOpen(false);
              }}
              onClose={() => {
                setDateOpen(false);
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
            <Popup
              visible={createOpen}
              destroyOnClose={true}
              onMaskClick={() => {
                setCreateOpen(false);
              }}
              onClose={() => {
                setCreateOpen(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "358px",
              }}
            >
              <CreatePopup closePopup={closePopup} />
            </Popup>
            <Popup
              visible={exportOpen}
              destroyOnClose={true}
              onMaskClick={() => {
                setExportOpen(false);
              }}
              onClose={() => {
                setExportOpen(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "358px",
              }}
            >
              <ExportPopup closeExportPopup={closeExportPopup} />
            </Popup>
          </div>
        }
      />
    </>
  );
}
