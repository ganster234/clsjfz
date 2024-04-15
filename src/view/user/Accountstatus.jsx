import React, { useState, useEffect } from "react";
import { getaccounttable } from "../../api/user";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { CenterPopup, Button } from "antd-mobile";
import { Table } from "antd";
import { produce } from "immer";
import { myaccountdata } from "../../utils/columns";
import "../open/Open.less";
import "../../assets/css/Calendar.less";

export default function Equipment() {
  const [isModalOpen, setIsModalOpen] = useState(false); //模态框
  const navigate = useNavigate();
  const [height, setHeight] = useState(520);
  const [data, setData] = useState({
    loading: false, //表格加载
    Tabledata: [], //表格数据
    deadData: [], //死号数据
    seek: "", //搜索
  });
  // console.log(CalendarPicker);
  useEffect(() => {
    setData(
      produce(data, (draftState) => {
        draftState.loading = true;
      })
    );
    xuanran();
  }, []);

  const xuanran = (val) => {
    getaccounttable({
      order_id: val ? (data.seek ? data.seek : "1") : "1",
    }).then((res) => {
      if (res) {
        setData(
          produce(data, (draftState) => {
            draftState.Tabledata = res.data?.data ? res.data.data : [];
            draftState.deadData = res.data?.error ? res.data.error : [];
            draftState.loading = false;
          })
        );
      }
    });
  };
  return (
    <LayoutPanel
      top={
        <div className="open-top" style={{ height: "50px" }}>
          <div className="open-input">
            <img
              src={require("../../assets/image/back-icon.png")}
              alt=""
              className="open-input-back"
              onClick={() => navigate(-1)}
            />
            <Input
              value={data.seek}
              className="open-top-input "
              placeholder="订单号/用户查询"
              bordered={false}
              onChange={(e) => {
                setData(
                  produce(data, (draftState) => {
                    draftState.seek = e.target.value;
                  })
                );
              }}
              onBlur={(e) => {
                setData(
                  produce(data, (draftState) => {
                    draftState.loading = true;
                  })
                );
                xuanran(true);
              }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
      }
      content={
        <section
          style={{
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "6px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={() => {
                setIsModalOpen(true);
              }}
              size="mini"
              color="primary"
            >
              死号查询
            </Button>
          </div>
          <Table
            loading={data.loading} //表格加载
            scroll={{
              x: 1100,
              y: height,
            }}
            pagination={false}
            rowKey="order_id"
            dataSource={data.Tabledata}
            columns={[
              ...myaccountdata,
              {
                title: <div>状态</div>,
                render(_, row) {
                  return (
                    <div>
                      {row.status === 0 ? (
                        <p style={{ color: "#52C41A" }}>正常</p>
                      ) : (
                        <p style={{ color: "red" }}>失效</p>
                      )}
                    </div>
                  );
                },
              },
              {
                title: <div>是否自动售后</div>,
                render(_, row) {
                  return (
                    <div>
                      {row.aftersaleed === 0 ? (
                        <p>未售后</p>
                      ) : row.aftersaleed === 1 ? (
                        <p>自动售后</p>
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                  );
                },
              },
              {
                title: <div>是否使用</div>,
                render(_, row) {
                  return (
                    <div>
                      {row.first_auth === 0 ? (
                        <p>已使用</p>
                      ) : row.first_auth === 1 ? (
                        <p>未使用</p>
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                  );
                },
              },
            ]}
          />
          <CenterPopup
            visible={isModalOpen}
            onMaskClick={() => {
              setIsModalOpen(false);
            }}
          >
            <Table
              scroll={{
                y: 500,
              }}
              pagination={false}
              rowKey="app_name"
              dataSource={data.deadData}
              columns={[
                {
                  title: <div>项目</div>,
                  render(_, row) {
                    return <div>{row.app_name}</div>;
                  },
                },
                {
                  title: <div>死号数量</div>,
                  render(_, row) {
                    return <div>{row.count}</div>;
                  },
                },
              ]}
            />
          </CenterPopup>
        </section>
      }
    ></LayoutPanel>
  );
}
