/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Table, message } from "antd";
import { Popup, Calendar, Picker } from "antd-mobile";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import CreatePopup from "./components/CreatePopup";
import ExportPopup from "./components/ExportPopup";
import { getOpenList } from "../../api/open";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { openColumns } from "../../utils/columns";

import "./Ck.less";
import "../../assets/css/Calendar.less";

const basicColumns = [
  [
    { label: "套餐(Q)", value: "1" },
    { label: "套餐(W)", value: "2" },
  ],
];
export default function Ck() {
  const navigate = useNavigate();
  const [height, setHeight] = useState(0);
  const [ckLoading, setCkLoading] = useState(false); //加载
  const [tableList, setTableList] = useState([]); //table数据
  const [total, setTotal] = useState(0); // 总条数
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });
  const [dateck, setDateck] = useState(false); //时间
  const [createck, setCreateck] = useState(false); //创建ck
  const [exportck, setExportck] = useState(false); //导出
  const [state, setState] = useState({
    dateList: [new Date(), new Date()], //开始时间结束时间
    name: "",
    Sid: "", //任务编号
    Type: "2", //1op,2ck
  });
  const Userid = sessionStorage.getItem("user");
  const [channelVisible, setChannelVisible] = useState(false); //显示类别
  const [lytype, setLytype] = useState({ label: "套餐(Q)", value: "1" }); //显示类别 1q 2v

  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getList();
  }, [
    JSON.stringify(tableParams),
    JSON.stringify(state),
    JSON.stringify(lytype),
  ]);

  const getList = async () => {
    const { dateList, name, Type, Sid } = state;
    const { current, pageSize } = tableParams.pagination;
    let param = {
      Sid: Sid, //任务sid
      Username: name, //用户名
      Userid, //用户sid
      Type, //1
      Lytype: lytype.value, //q或者v
      Stime: dateList[0] && dayjs(dateList[0]).format("YYYY-MM-DD"), //开始时间
      Etime: dateList[1] && dayjs(dateList[1]).format("YYYY-MM-DD"), //结束时间
      Pagenum: current.toString(), //页数
      Pagesize: pageSize.toString(), //一页多少
    };
    setCkLoading(true);
    let result = await getOpenList(param);
    const { code, data, msg } = result || {};
    message.destroy();
    if (code) {
      setTableList([...data]);
      setTotal(Number(result.pagenum));
    } else {
      message.error(msg);
    }
    setCkLoading(false);
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTableList([]);
    }
  };

  const closePopup = (data, str) => {
    setCreateck(data);
    if (str) {
      getList();
    }
  };
  const closeExportPopup = (data) => {
    setExportck(data);
  };

  const changeState = (str, item) => {
    if (Array.isArray(item) && item.length > 0) {
      const [value] = item;
      const foundItem = basicColumns[0].find((obj) => obj.value === value);

      setLytype({ ...foundItem });

      console.log(foundItem, "foundItem", value);
    }
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="ck-top">
            <div className="ck-input">
              <img
                src={require("../../assets/image/back-icon.png")}
                alt=""
                className="ck-input-back"
                onClick={() => navigate(-1)}
              />
              <Input
                value={state?.name}
                className="ck-top-input "
                placeholder="搜索用户名称"
                bordered={false}
                onChange={(even) => {
                  setState((item) => ({ ...item, name: even.target.value }));
                }}
                prefix={<SearchOutlined />}
              />
            </div>
            <div className="ck-date-and-time">
              <span
                className="ck-top-date-time"
                onClick={() => setDateck(true)}
              >
                选择时间
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="ck-date-and-time-triangle"
                />
              </span>
              <span
                className="ck-top-date-time"
                onClick={() => setChannelVisible(true)}
              >
                <span>{lytype.label}</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="ck-date-and-time-triangle"
                />
              </span>
              <span className="create-and-export">
                {/* <span
                  className="create-and-export-item"
                  onClick={() => setCreateck(true)}
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
                  onClick={() => setExportck(true)}
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
          <div className="ck-content">
            <div className="ck-content-time">
              {dayjs(state?.dateList[0]).format("YYYY年MM月DD日")}-
              {dayjs(state?.dateList[1]).format("YYYY年MM月DD日")}
            </div>
            <div className="ck-content-table-box">
              <div className="ck-content-table-box-title">提取ck</div>
              <Table
                scroll={{
                  x: 1500,
                  y: height,
                }}
                loading={ckLoading}
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
                      <span className="ckid-task-id">{record}</span>
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
                              ? "ck-task-status ck-task-status-active"
                              : "ck-task-status"
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
              visible={dateck}
              destroyOnClose={true}
              onMaskClick={() => {
                setDateck(false);
              }}
              onClose={() => {
                setDateck(false);
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
              visible={createck}
              destroyOnClose={true}
              onMaskClick={() => {
                setCreateck(false);
              }}
              onClose={() => {
                setCreateck(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "381px",
              }}
            >
              <CreatePopup closePopup={closePopup} />
            </Popup>
            <Popup
              visible={exportck}
              destroyOnClose={true}
              onMaskClick={() => {
                setExportck(false);
              }}
              onClose={() => {
                setExportck(false);
              }}
              position="bottom"
              bodyStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                minHeight: "381px",
              }}
            >
              <ExportPopup closeExportPopup={closeExportPopup} />
            </Popup>
            <Picker
              columns={basicColumns}
              visible={channelVisible}
              onClose={() => {
                setChannelVisible(false);
              }}
              value={lytype.value}
              onConfirm={(v) => {
                changeState("type", v);
              }}
            />
          </div>
        }
      />
    </>
  );
}
