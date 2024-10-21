import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, message, Switch, Button } from "antd";
import { Popup, Input } from "antd-mobile";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { settlement } from "../../utils/columns";
import { payprice, setpayprice, addpayprice } from "../../api/count";
import { Picker } from "antd-mobile";

import "../process/Process.less";
import "../project/Project.less";
import "../../assets/css/Calendar.less";

export default function Process() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [showGoldWay, setShowGoldWay] = useState(false); //显示项目选择器
  const [goldWay, setGoldWay] = useState(""); //选项选中的值
  const [paydesignation, setpaydesignation] = useState(""); //支付名称
  const [payway, setpayway] = useState(""); //支付类型
  const [remark, setremark] = useState(""); //备注
  const [price, setprice] = useState(""); //充值额
  const [my_id, setmy_id] = useState(""); //ID
  const [mch_wx_key, setmch_wx_key] = useState(""); //商户号
  const [wx_app_id, setwx_app_id] = useState(""); //wx_app_id
  const [xuliehao, setxuliehao] = useState(""); //序列号
  const [notify_url, setnotify_url] = useState(""); //回调地址
  const [fenclass, setfenclass] = useState({}); //分类
  const goldColumns = [
    { value: "", label: "全部" },
    { value: "0", label: "开启" },
    { value: "1", label: "关闭" },
  ];
  const [additem, setadditem] = useState(""); //模态框
  useEffect(() => {
    // 初始化数据包括后续更新
    getList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async () => {
    setLoading(true);
    let result = await payprice({ State: goldWay });
    const { code, msg, data } = result || {};
    if (code) {
      setDataList(data);
    } else {
      message.error(msg);
    }
    setLoading(false);
  };
  const handleOk = () => {
    if (additem === "修改支付") {
      if (
        paydesignation === "" ||
        price === "" ||
        remark === "" ||
        payway === ""
      ) {
        message.warning("请完成填写相关内容");
      } else {
        setpayprice({
          // id: my_id,
          // pay_name: paydesignation,
          // url: payway,
          // price,
          // remark,
          Sid: my_id + "",
          Type: fenclass.Device_type,
          Name: paydesignation,
          Money: price,
          Remark: remark,
          Bussid: mch_wx_key,
          Appid: wx_app_id,
          Number: xuliehao,
          Api: notify_url,
          Url: payway,
        }).then((result) => {
          const { code, msg } = result || {};
          // eslint-disable-next-line eqeqeq
          if (code == 200) {
            getList();
            setadditem("");
            setremark("");
            message.success("修改成功");
          } else {
            message.error(msg);
          }
        });
      }
    } else {
      if (
        paydesignation === "" ||
        price === "" ||
        remark === "" ||
        payway === ""
      ) {
        message.warning("请完成填写相关内容");
      } else {
        addpayprice({
          // pay_name: paydesignation,
          // pay_type: payway,
          Name: paydesignation,
          Type: payway,
          Money: price,
          Remark: remark,
          Bussid: mch_wx_key,
          Appid: wx_app_id,
          Number: xuliehao,
          Api: notify_url,
        }).then((result) => {
          const { code, msg } = result || {};
          // eslint-disable-next-line eqeqeq
          if (code == 200) {
            getList();
            message.success("新增成功");
            setadditem("");
            setpaydesignation("");
            setpayway("");
          } else {
            message.error(msg);
          }
        });
      }
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
              支付管理
            </div>
            <div className="process-top-screen">
              <span
                className="process-top-screen-item"
                onClick={() => setShowGoldWay(true)}
              >
                <span>状态查询</span>
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
            <div style={{ padding: "5px", backgroundColor: "white" }}>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  setpaydesignation("");
                  setpayway("");
                  setadditem("新增支付");
                }}
              >
                新增支付
              </Button>
              <Table
                scroll={{
                  x: 440,
                  y: 520,
                }}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={false}
                columns={[
                  ...settlement,
                  {
                    title: "状态控制",
                    render: (record) => (
                      <>
                        <Switch
                          checked={record.Device_state === "0" ? true : false}
                          checkedChildren="开启"
                          unCheckedChildren="关闭"
                          defaultChecked
                          onChange={() => {
                            setLoading(true);
                            const is_use =
                              record.Device_state === "0" ? "1" : "0";
                            setpayprice({
                              State: is_use,
                              Sid: record.Device_Sid,
                            }).then((result) => {
                              const { code, msg } = result || {};
                              // eslint-disable-next-line eqeqeq
                              if (code == 200) {
                                getList();
                                message.success("修改成功");
                                setLoading(false);
                              } else {
                                setLoading(false);
                                message.error(msg);
                              }
                            });
                          }}
                        />
                      </>
                    ),
                  },
                  {
                    title: "操作",
                    render: (record) => (
                      <Button
                        onClick={() => {
                          setpaydesignation(record.Device_name);
                          setpayway(record.Device_url);
                          setprice(record.Device_money);
                          setremark(record.Device_remark);
                          setmy_id(record.Device_Sid);
                          setmch_wx_key(record.Device_bussid);
                          setwx_app_id(record.Device_appid);
                          setxuliehao(record.Device_munber);
                          setnotify_url(record.Device_api);
                          setfenclass(record);
                          setadditem("修改支付");
                        }}
                        size="small"
                        type="primary"
                      >
                        修改
                      </Button>
                    ),
                  },
                ]}
                dataSource={dataList}
              />
            </div>
          </div>
        }
      />
      <Picker
        columns={[goldColumns]}
        visible={showGoldWay}
        onClose={() => {
          setShowGoldWay(false);
        }}
        onConfirm={() => {
          getList();
        }}
        value={[goldWay]}
        onSelect={(v) => {
          setGoldWay(v[0]);
        }}
      />
      <Popup
        onMaskClick={() => {
          setadditem("");
        }}
        onClose={() => {
          setadditem("");
        }}
        visible={additem}
        position="top"
      >
        <p className="headline">{additem}</p>
        <div className="addXM">
          <ul>
            <li>
              <p className="form-label">支付名称：</p>
              <Input
                style={{
                  "--placeholder-color": "#BFBFBF",
                  "--font-size": "16px",
                  "--color": "#666666",
                }}
                value={paydesignation}
                placeholder="请输入相关内容"
                onChange={(even) => setpaydesignation(even)}
                clearable
              />
            </li>
            <li>
              <p>{additem === "新增支付" ? "支付类型：" : "URL："}</p>
              <Input
                style={{
                  "--placeholder-color": "#BFBFBF",
                  "--font-size": "16px",
                  "--color": "#666666",
                }}
                value={payway}
                placeholder="请输入相关内容"
                onChange={(even) => setpayway(even)}
                clearable
              />
            </li>

            <li>
              <p>充值额：</p>
              <Input
                value={price}
                placeholder="请输入相关内容"
                onChange={(val) => setprice(val)}
              ></Input>
            </li>
            <li>
              <p>备注：</p>
              <Input
                value={remark}
                placeholder="请输入相关内容"
                onChange={(val) => setremark(val)}
              ></Input>
            </li>
            <li>
              <p>商户号：</p>
              <Input
                value={mch_wx_key}
                placeholder="请输入相关内容"
                onChange={(val) => setmch_wx_key(val)}
              ></Input>
            </li>
            <li>
              <p>app_id：</p>
              <Input
                value={wx_app_id}
                placeholder="请输入相关内容"
                onChange={(val) => setwx_app_id(val)}
              ></Input>
            </li>
            <li>
              <p>序列号：</p>
              <Input
                value={xuliehao}
                placeholder="请输入相关内容"
                onChange={(val) => setxuliehao(val)}
              ></Input>
            </li>
            <li>
              <p>回调地址：</p>
              <Input
                value={notify_url}
                placeholder="请输入相关内容"
                onChange={(val) => setnotify_url(val)}
              ></Input>
            </li>
          </ul>
          <footer>
            <Button onClick={() => handleOk()} type="primary">
              提交
            </Button>
          </footer>
        </div>
      </Popup>
    </>
  );
}
