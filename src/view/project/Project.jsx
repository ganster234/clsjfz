import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, message, Spin } from "antd";
import { Popup, Input } from "antd-mobile";

import LayoutPanel from "../../components/layoutPanel/LayoutPanel";
import { getResidueHeightByDOMRect } from "../../utils/utils";
import {
  getProjectList,
  getChangeShare,
  getChangePrice,
} from "../../api/project";
import { projectColumns } from "../../utils/columns";

import "./Project.less";

export default function Project() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [total, setTotal] = useState(0); // 总条数
  const [dataList, setDataList] = useState([]);
  const [height, setHeight] = useState(436);
  const [detailsShow, setSetailsShow] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, //当前页码
      pageSize: 10, // 每页数据条数
    },
  });

  // 初始化
  useEffect(() => {
    //高度自适应
    setHeight(getResidueHeightByDOMRect() + 88);
    window.onresize = () => {
      setHeight(getResidueHeightByDOMRect());
    };
    getList();
  }, [JSON.stringify(tableParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  // 获取list
  const getList = async () => {
    setLoading(true);
    const { pageSize, current } = tableParams.pagination;
    let result = await getProjectList({
      page: current,
      limit: pageSize,
    });
    const { code, data, msg } = result || {};
    if (code === 200) {
      let list = data?.data;
      list.forEach((element, i) => {
        element.data.forEach((item, index) => {
          element["key"] = i;
          element["distribution_price" + +(index + 1)] =
            item.distribution_price;
        });
      });
      setTotal(data?.total);
      setDataList([...data.data]);
      setLoading(false);
    } else {
      message.destroy();
      message.open({
        type: "error",
        content: msg,
      });
    }
  };

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataList([]);
    }
  };
  const projectEdit = (record) => {
    setProjectDetails((item) => ({ ...item, ...record }));
    setSetailsShow(true);
  };

  const changeValue = (index, even) => {
    const { data } = projectDetails;
    let list = [...data];
    list[index].distribution_price = even;
    setProjectDetails((item) => ({
      ...item,
      data: [...list],
    }));
  };

  const inputDetailBlur = async (index, str) => {
    const { id, data } = projectDetails;
    const item = data[index];
    console.log(item, projectDetails);
    if (str) {
      if (item) {
        setPopupLoading(true);
        let result = await getChangePrice({
          price_id: projectDetails.app_id,
          package_id: item.id,
          price: item.distribution_price,
        });
        message.destroy();
        if (result?.code === 200) {
          message.success("修改成功");
          getList();
        } else {
          message.error(result?.msg || "");
        }
      }
    } else {
      if (item) {
        setPopupLoading(true);
        let result = await getChangeShare({
          price_id: id,
          package_id: item.id,
          is_share: item?.is_share,
        });
        message.destroy();
        if (result?.code === 200) {
          message.success("修改成功");
          const { data } = projectDetails;
          let list = [...data];
          list[index].is_share = list[index].is_share === 0 ? 1 : 0;
          setProjectDetails((item) => ({
            ...item,
            data: [...list],
          }));
        } else {
          message.error(result?.msg || "");
        }
      }
    }
    setPopupLoading(false);
  };
  return (
    <>
      <LayoutPanel
        top={
          <div className="project-top">
            <img
              src={require("../../assets/image/back-icon.png")}
              alt=""
              className="project-top-back-icon"
              onClick={() => navigate(-1)}
            />
            项目管理
          </div>
        }
        content={
          <div className="project-content">
            <div className="project-content-main">
              <div className="project-content-main-title">项目管理</div>
              <Table
                rowClassName={(record, i) => (i % 2 === 1 ? "even" : "odd")} // 重点是这个api
                scroll={{
                  x: 770,
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
                  {
                    title: "订单ID",
                    dataIndex: "app_id",
                  },
                  ...projectColumns,
                  {
                    title: "操作",
                    width: 200,
                    render: (record) => (
                      <span
                        className="project-edit"
                        onClick={() => projectEdit(record)}
                      >
                        编辑
                      </span>
                    ),
                  },
                ]}
                dataSource={dataList}
              />
            </div>
            <Popup
              visible={detailsShow}
              onMaskClick={() => {
                setSetailsShow(false);
              }}
              onClose={() => {
                setSetailsShow(false);
              }}
              bodyStyle={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                padding: "20px 0 ",
                overflowY: "scroll",
                minHeight: "60vh",
              }}
            >
              <Spin spinning={popupLoading}>
                {projectDetails?.data &&
                  projectDetails?.data.map((subItem, index) => {
                    return (
                      <div className="popup-details-item" key={index}>
                        <span className="popup-details-item-title">
                          {subItem?.name}:
                        </span>
                        <span className="popup-details-item-content">
                          <span className="popup-details-item-content-main">
                            <Input
                              value={subItem?.distribution_price}
                              readOnly={subItem?.is_share === 1}
                              onChange={(even) => {
                                changeValue(index, even);
                              }}
                              onBlur={() => inputDetailBlur(index, "blur")}
                            />
                          </span>
                        </span>
                        <span className="popup-details-item-right">
                          <img
                            src={
                              subItem?.is_share === 0
                                ? require("../../assets/image/project/project-radios-show.png")
                                : require("../../assets/image/project/project-radios.png")
                            }
                            alt=""
                            className="popup-details-item-icon"
                          />
                          <span onClick={() => inputDetailBlur(index)}>
                            {subItem?.is_share === 0 ? "启用" : "禁用"}
                          </span>
                        </span>
                      </div>
                    );
                  })}
              </Spin>
            </Popup>
          </div>
        }
      />
    </>
  );
}
