import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Table, Popconfirm, Button, Modal } from "antd";
import { Input, Popup } from "antd-mobile";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { priceManageColumns } from "../../utils/columns";
import { getUserPriceList, getDelPrice } from "../../api/user";
import PricePopup from "./components/PricePopup";

import "./UserPrice.less";

export default function UserPrice() {
  const navigate = useNavigate();
  const [height, setHeight] = useState(500);
  const [loading, setLoading] = useState(false);
  const [addPriceShow, setAddPriceShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [userName, setUserName] = useState("");
  const [priceName, setPriceName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
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
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (str) => {
    const { current, pageSize } = tableParams.pagination;
    setLoading(true);
    let result = await getUserPriceList({
      username: str ? "" : userName,
      price_name: str ? "" : priceName,
      page: str ? 1 : current,
      limit: str ? 10 : pageSize,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      setDataList([...data?.data]);
      setLoading(false);
      setTotal(data.total);
    } else {
      message.destroy();
      message.error(msg);
    }
  };
  //删除
  const confirmDelete = async (data) => {
    if (!data?.id) {
      return;
    }
    let result = await getDelPrice({ id: data?.id });
    if (result?.code === 200) {
      message.destroy();
      message.success("删除成功");
      getList();
    }
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  //查询
  const comfigModal = () => {
    const { pagination } = tableParams;
    if (pagination.current === 1) {
      getList();
    } else {
      setTableParams((item) => ({
        ...item,
        pagination: { current: 1, pageSize: 10 },
      }));
    }
    setIsModalOpen(false);
  };
  //重置
  const cancelModal = () => {
    const { pagination } = tableParams;
    setUserName();
    setPriceName();
    if (pagination.current === 1) {
      getList("str");
    } else {
      setTableParams((item) => ({
        ...item,
        pagination: { current: 1, pageSize: 10 },
      }));
    }
    setIsModalOpen(false);
  };

  const closePricePopup=()=>{
    setAddPriceShow(false)
    getList()
  }
  return (
    <>
      <LayoutPanel
        top={
          <div className="user-price-top-box">
            <div className="user-price-top">
              <img
                src={require("../../assets/image/back-icon.png")}
                alt=""
                className="user-price-top-back-icon"
                onClick={() => navigate(-1)}
              />
              用户价格管理
              <span
                className="user-price-top-right"
                onClick={() => setAddPriceShow(true)}
              >
                新增
              </span>
            </div>
            <div className="user-price-date-box">
              <div
                className="user-price-date-item"
                onClick={() => setIsModalOpen(true)}
              >
                <span>项目名称</span>
                <img
                  src={require("../../assets/image/triangle.png")}
                  alt=""
                  className="user-price-date-triangle"
                />
              </div>
            </div>
          </div>
        }
        content={
          <div className="user-price-content">
            <div className="user-price-main">
              <div className="user-price-main-title">用户价格管理</div>
              <Table
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
                columns={[
                  ...priceManageColumns,
                  {
                    title: "操作",
                    render: (record) => (
                      <Popconfirm
                        title="提示"
                        description="是否确认要删除此套餐?"
                        onConfirm={() => confirmDelete(record)}
                        okText="确认"
                        cancelText="取消"
                      >
                        <Button type="primary" danger>
                          删除
                        </Button>
                      </Popconfirm>
                    ),
                  },
                ]}
                dataSource={dataList}
              />
            </div>
            <Modal
              title={null}
              open={isModalOpen}
              destroyOnClose
              onOk={() => {
                comfigModal();
              }}
              okText="查询"
              cancelText="重置"
              onCancel={() => {
                cancelModal();
              }}
            >
              <div className="price-name-item">
                <Input
                  value={userName}
                  placeholder="请输入用户名称"
                  clearable
                  style={{
                    flex: 1,
                    "--placeholder-color": "#BFBFBF",
                    "--font-size": "14px",
                  }}
                  onChange={(even) => {
                    setUserName(even);
                  }}
                />
              </div>
              <div className="price-name-item">
                <Input
                  value={priceName}
                  placeholder="请输入项目名称"
                  clearable
                  style={{
                    flex: 1,
                    "--placeholder-color": "#BFBFBF",
                    "--font-size": "14px",
                  }}
                  onChange={(even) => {
                    setPriceName(even);
                  }}
                />
              </div>
            </Modal>
            <Popup
              visible={addPriceShow}
              onMaskClick={() => {
                setAddPriceShow(false);
              }}
              destroyOnClose
              onClose={() => {
                setAddPriceShow(false);
              }}
              bodyStyle={{
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                minHeight: "516px",
              }}
            >
              <PricePopup closePricePopup={closePricePopup}/>
            </Popup>
          </div>
        }
      />
    </>
  );
}
