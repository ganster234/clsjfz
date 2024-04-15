import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, message, Popconfirm, Modal } from "antd";
import { Input } from "antd-mobile";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { groupColumns } from "../../utils/columns";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import { getGroupList, getDelGroup, postAddGroup } from "../../api/group";

import "./Group.less";

export default function Group() {
  const navigate = useNavigate();
  const [addGroupShow, setAddGroupShow] = useState(false);
  const [addGroupName, setAddGroupName] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [height, setHeight] = useState(436);
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
    let result = await getGroupList({
      page: current,
      limit: pageSize,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      setDataList([...data?.data]);
      setTotal(data?.total);
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

  const confirmDelete = async (record) => {
    if (!record.id) {
      return;
    }
    let result = await getDelGroup({ id: record.id });
    message.destroy();
    if (result?.code === 200) {
      message.success(result?.msg);
      getList();
    } else {
      message.error(result?.msg);
    }
  };

  //添加分组
  const addGroup = async () => {
    if (!addGroupName) {
      message.destroy();
      return message.error("请输入要添加的分组名称");
    }
    setConfirmLoading(true);
    let result = await postAddGroup({ name: addGroupName });
    message.destroy();
    if (result?.code === 200) {
      setAddGroupName("");
      message.success("添加成功");
      setAddGroupShow(false);
      getList();
    } else {
      message.error(result.msg);
    }
    setConfirmLoading(false);
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="group-top">
            <img
              src={require("../../assets/image/back-icon.png")}
              alt=""
              className="group-top-back-icon"
              onClick={() => navigate(-1)}
            />
            分组管理
            <span className="add-group" onClick={() => setAddGroupShow(true)}>
              添加分组
            </span>
          </div>
        }
        content={
          <div className="group-content">
            <div className="group--main">
              <div className="group--main-title">分组管理</div>
              <Table
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                scroll={{
                  x: 800,
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
                  ...groupColumns,
                  {
                    title: "操作",
                    width: "150",
                    render: (record) => (
                      <div>
                        <Popconfirm
                          title="提示"
                          description="确定要删除吗?"
                          onConfirm={() => confirmDelete(record)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <span className="group-edit">删除</span>
                        </Popconfirm>
                      </div>
                    ),
                  },
                ]}
                dataSource={dataList}
              />
            </div>
            <Modal
              title={null}
              closeIcon={null}
              open={addGroupShow}
              confirmLoading={confirmLoading}
              width={276}
              onOk={() => {
                addGroup();
              }}
              destroyOnClose
              onCancel={() => {
                setAddGroupShow(false);
              }}
            >
              <div className="group-popup-body">
                新建分组
                <img
                  src={require("../../assets/image/popup-back.png")}
                  alt=""
                  className="group-popup-back"
                  onClick={() => setAddGroupShow(false)}
                />
              </div>
              <div className="group-modal-input">
                <span>分组名称</span>
                <Input
                  placeholder="请输入内容"
                  value={addGroupName}
                  clearable
                  style={{
                    flex: 1,
                    marginLeft: "2px",
                    "--font-size": "14px",
                    "--placeholder-color": "#BFBFBF",
                  }}
                  onChange={(even) => {
                    setAddGroupName(even);
                  }}
                />
              </div>
            </Modal>
          </div>
        }
      />
    </>
  );
}
