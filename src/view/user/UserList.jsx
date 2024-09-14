import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Button, Table, Popconfirm, Spin, Modal } from "antd";
import { Input } from "antd";
import useAppStore from "../../store";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import {
  getUserList,
  setInterdict,
  addBalance,
  setIncome,
  setPasswod,
} from "../../api/user";
import { userListColumns } from "../../utils/columns";
import { SearchOutlined } from "@ant-design/icons";
import "../open/Open.less";
import "./UserList.less";

export default function UserList() {
  const navigate = useNavigate();
  const role = useAppStore((state) => state.role);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [height, setHeight] = useState(436);
  const [interdictLoading, setInterdictLoading] = useState(false);
  const [moneyShow, setMoneyShow] = useState(false);
  const [moneyConfirmLoading, setMoneyConfirmLoading] = useState(false);
  const [moneyItem, setMoneyItem] = useState({});
  const [balance, setBalance] = useState("");
  const [username, setUsername] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });

  // 初始化
  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect());
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    setLoading(true);
    let result = await getUserList({
      page: str ? 1 : current,
      limit: str ? 10 : pageSize,
      username: str ? "" : username,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      if (data?.data) {
        setDataList([...data.data]);
        setTotal(data?.total);
        setLoading(false);
      }
    } else {
      message.destroy();
      message.error(msg);
    }
  };

  const interdict = async (record) => {
    const { account, disable } = record;
    setInterdictLoading(true);
    let result = await setInterdict({
      username: account,
      disable: disable === 0 ? 1 : 0,
    });

    const { code } = result || {};
    if (code === 200) {
      setInterdictLoading(false);
      message.destroy();
      message.success("操作成功");
      getList();
    }
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };

  const changeMoney = async () => {
    console.log(moneyItem, balance);
    if (!moneyItem.account || !balance) {
      message.destroy();
      return message.error("请输入修改金额");
    }
    setMoneyConfirmLoading(true);
    let result = await addBalance({ username: moneyItem.account, balance });
    const { code, msg } = result || {};
    message.destroy();
    if (code === 200) {
      message.success(msg);
      setBalance("");
      getList();
      setMoneyShow(false);
    } else {
      message.success(msg);
    }
    setMoneyConfirmLoading(false);
  };

  // 设置代理
  const setupIncome = async (record, str) => {
    let result = await setIncome({
      id: record.id + "",
      status: str ? "1" : "0",
    });
    if (result?.code === 200) {
      message.success("设置成功");
      getList();
    } else {
      message.error(result?.msg);
    }
  };

  const getUser = () => {
    const { current, pageSize } = tableParams.pagination;
    if (pageSize !== 10 || current !== 1) {
      setTableParams({
        pagination: {
          current: 1,
          pageSize: 10,
        },
      });
    } else {
      getList();
    }
  };

  return (
    <>
      <LayoutPanel
        top={
          <div style={{ height: "60px" }} className="open-top">
            <div className="open-input">
              <img
                src={require("../../assets/image/back-icon.png")}
                alt=""
                className="open-input-back"
                onClick={() => navigate(-1)}
              />
              <Input
                onPressEnter={() => {
                  getUser();
                }}
                onBlur={() => {
                  getUser();
                }}
                style={{ padding: " 0 15px" }}
                value={username}
                className="open-top-input "
                placeholder="搜索用户名称"
                bordered={false}
                onChange={(even) => setUsername(even.target.value)}
                prefix={<SearchOutlined />}
              />
            </div>
          </div>
        }
        content={
          <div className="user-list-content">
            <div className="user-list-main">
              <Spin tip="提交中..." spinning={interdictLoading} size="large">
                <div className="user-list-main-title">用户列表</div>
                <Table
                  rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                  scroll={{
                    x: 1030,
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
                    ...userListColumns,
                    {
                      title: "操作",
                      width: 400,
                      render: (record) => (
                        <>
                          {role &&
                            (role === "admin" || role === "superAdmin") && (
                              <>
                                {role && role === "superAdmin" && (
                                  <>
                                    {record.income_use === 0 && (
                                      <Popconfirm
                                        title="提示"
                                        description="是否为当前账号设置代理？"
                                        onConfirm={() =>
                                          setupIncome(record, "setup")
                                        }
                                        okText="确认"
                                        cancelText="取消"
                                      >
                                        <Button
                                          size="small"
                                          type="primary"
                                          style={{
                                            background: "#95de64",
                                            marginRight: "10px",
                                          }}
                                        >
                                          设为代理
                                        </Button>
                                      </Popconfirm>
                                    )}
                                    {record.income_use === 1 && (
                                      <Popconfirm
                                        title="提示"
                                        description="是否取消当前账号代理？"
                                        onConfirm={() => setupIncome(record)}
                                        okText="确认"
                                        cancelText="取消"
                                      >
                                        <Button
                                          size="small"
                                          type="primary"
                                          style={{
                                            marginRight: "10px",
                                          }}
                                          danger
                                        >
                                          取消代理
                                        </Button>
                                      </Popconfirm>
                                    )}
                                  </>
                                )}

                                {record.disable === 0 && (
                                  <Popconfirm
                                    title="提示"
                                    description="是否确认禁用当前账号？"
                                    onConfirm={() => interdict(record)}
                                    okText="确认"
                                    cancelText="取消"
                                  >
                                    <Button size="small" type="primary" danger>
                                      禁用
                                    </Button>
                                  </Popconfirm>
                                )}
                                {record.disable === 1 && (
                                  <Button
                                    size="small"
                                    type="primary"
                                    style={{ background: "#95de64" }}
                                    onClick={() => interdict(record)}
                                  >
                                    启用
                                  </Button>
                                )}
                                {/* <Button
                                  size="small"
                                  type="primary"
                                  style={{ marginRight: "10px" }}
                                  onClick={() => {
                                    setMoneyItem({ ...record });
                                    setMoneyShow(true);
                                  }}
                                >
                                  修改余额
                                </Button> */}
                                <Popconfirm
                                  title="提示"
                                  description="当前操作将重置用户密码是否继续？"
                                  onConfirm={async () => {
                                    let result = await setPasswod({
                                      user_id: [record.id],
                                    });
                                    if (result?.code === 200) {
                                      message.success("重置成功");
                                    } else {
                                      message.error(result?.msg);
                                    }
                                  }}
                                  okText="确认"
                                  cancelText="取消"
                                >
                                  <Button
                                    style={{ marginLeft: "10px" }}
                                    size="small"
                                    danger
                                  >
                                    重置密码
                                  </Button>
                                </Popconfirm>
                              </>
                            )}
                          {role && role === "role" && <>--</>}
                        </>
                        // <div>
                        //   <Button
                        //     type="primary"
                        //     style={{ marginRight: "10px" }}
                        //     onClick={() => {
                        //       setMoneyItem({ ...record });
                        //       setMoneyShow(true);
                        //     }}
                        //   >
                        //     修改余额
                        //   </Button>
                        //   {record.disable === 0 && (
                        //     <Popconfirm
                        //       title="提示"
                        //       description="是否确认禁用当前账号？"
                        //       onConfirm={() => interdict(record)}
                        //       okText="确认"
                        //       cancelText="取消"
                        //     >
                        //       <Button type="primary" danger>
                        //         禁用
                        //       </Button>
                        //     </Popconfirm>
                        //   )}
                        //   {record.disable === 1 && (
                        //     <Button
                        //       type="primary"
                        //       style={{ background: "#95de64" }}
                        //       onClick={() => interdict(record)}
                        //     >
                        //       启用
                        //     </Button>
                        //   )}
                        // </div>
                      ),
                    },
                  ]}
                  dataSource={dataList}
                />
              </Spin>
            </div>
            <Modal
              title={"修改余额"}
              open={moneyShow}
              confirmLoading={moneyConfirmLoading}
              onOk={() => {
                changeMoney();
              }}
              destroyOnClose
              onCancel={() => {
                setMoneyItem({});
                setBalance("");
                setMoneyShow(false);
              }}
            >
              <div className="money-modal-input">
                <Input
                  value={balance}
                  placeholder="请输入内容"
                  onChange={(even) => setBalance(even.target.value)}
                  style={{
                    "--font-size": "14px",
                    "--placeholder-color": "#BFBFBF",
                  }}
                />
              </div>
              {/* <div
                style={{ color: "red", fontSize: "14px", marginTop: "10px" }}
              >
                修改余额:是在当前余额的基础上累加
              </div> */}
            </Modal>
          </div>
        }
      />
    </>
  );
}
