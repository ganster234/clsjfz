import { Select } from "antd";
import dayjs from "dayjs";
const { Option } = Select;
const filterOption = (input, option) =>
  (option?.value ?? "").toLowerCase().includes(input.toLowerCase());
export const settlement = [
  {
    title: "支付名",
    dataIndex: "pay_name",
  },
  {
    title: "状态",
    dataIndex: "is_use",
    render: (record) => (
      <div>
        {record === 0 && "开启"}
        {record === 1 && "关闭"}
      </div>
    ),
  },
  {
    title: "支付类型",
    dataIndex: "pay_type",
  },
];
export const myaccountdata = [
  {
    title: "购买用户",
    dataIndex: "username",
  },
  {
    title: "下单时间",
    dataIndex: "create_time",
  },
  {
    title: "项目名称",
    dataIndex: "name",
  },
  {
    title: "套餐",
    dataIndex: "package_id",
  },
  {
    title: "账户",
    dataIndex: "account",
  },
  {
    title: "订单号",
    dataIndex: "order_id",
  },
];
export const typeConfig = {
  0: {
    tableWidht: 800,
    columns: [
      {
        title: "项目名",
        dataIndex: "app_name",
      },
      {
        title: "总量",
        dataIndex: "totals",
      },
    ],
  },
  1: {
    tableWidht: 1000,
    columns: [
      {
        title: "账号",
        dataIndex: "account",
      },
      {
        title: "总量",
        dataIndex: "totalNum",
      },
      {
        title: "总金额",
        dataIndex: "totalAmount",
      },
      {
        title: "项目",
        render: (record) => (
          <Select
            style={{ width: "160px" }}
            optionFilterProp="children"
            showSearch
            filterOption={filterOption}
          >
            {record.app_lst &&
              record.app_lst.map((item, index) => {
                return (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                );
              })}
          </Select>
        ),
      },
    ],
  },
  2: {
    tableWidht: 1000,
    columns: [
      {
        title: "项目ID",
        dataIndex: "app_id",
      },
      {
        title: "项目名称",
        dataIndex: "app_name",
      },
      {
        title: "套餐名称",
        dataIndex: "package_name",
        render: (record) => <span>{record ? record : "--"}</span>,
      },
      {
        title: "总量",
        dataIndex: "totalNum",
      },
      {
        title: "总金额",
        dataIndex: "totalAmount",
      },
    ],
  },
  3: {
    tableWidht: 600,
    columns: [
      {
        title: "账号",
        dataIndex: "account",
      },
      {
        title: "总金额",
        dataIndex: "totalAmount",
      },
    ],
  },
  4: {
    tableWidht: 600,
    columns: [
      {
        title: "账号",
        dataIndex: "account",
      },
      {
        title: "金额",
        dataIndex: "money",
      },
    ],
  },
  6: {
    tableWidht: 1000,
    columns: [
      {
        title: "项目ID",
        dataIndex: "app_id",
      },
      {
        title: "项目名称",
        dataIndex: "app_name",
      },
      {
        title: "套餐名称",
        dataIndex: "package_name",
        render: (record) => <span>{record ? record : "--"}</span>,
      },
      {
        title: "总量",
        // dataIndex: "totalNum",
        render: (record) => (
          <>
            <span>{record.totalNum || "0"}</span>
            {record.zhutotalNum && <span>({record.zhutotalNum})</span>}
          </>
        ),
      },
      // {
      //   title: "喜猫总量",
      //   dataIndex: "zhutotalNum",
      //   render: (record) => (
      //     <>
      //       <span>{record || "0"}</span>
      //     </>
      //   ),
      // },
      {
        title: "总金额",
        // dataIndex: "totalAmount",
        render: (record) => (
          <>
            <span>{record.totalAmount || "0"}</span>
            {record.zhutotalAmount && <span>({record.zhutotalAmount})</span>}
          </>
        ),
      },
      // {
      //   title: "喜猫总金额",
      //   dataIndex: "zhutotalAmount",
      //   render: (record) => (
      //     <>
      //       <span>{record || "0"}</span>
      //     </>
      //   ),
      // },
    ],
  },
};

export const openColumns = [
  {
    title: "用户名称",
    dataIndex: "account",
  },
  {
    title: "任务名称",
    dataIndex: "name",
  },
  {
    title: "任务数量",
    dataIndex: "num",
  },
  {
    title: "已完成数量",
    dataIndex: "requests_num",
  },
  {
    title: "已完成数量",
    dataIndex: "create_time",
  },
];

export const scanColumns = [
  {
    title: "appid",
    dataIndex: "app_id",
  },
  {
    title: "账号",
    dataIndex: "account",
    width: 260,
    render: (record) => <div>{record || "-"}</div>,
  },
  {
    title: "项目名称",
    dataIndex: "app_name",
    render: (record) => <div>{record || "-"}</div>,
  },
  {
    title: "订单号",
    dataIndex: "order_id",
    width: 260,
  },

  {
    title: "套餐名",
    dataIndex: "package_name",
    render: (record) => <div>{record || "-"}</div>,
  },
  {
    title: "扫码类型",
    dataIndex: "first_auth",
    render: (record) => (
      <span className={record ? "scan-type first" : "scan-type repeat"}>
        {record ? "首次扫码" : "复扫"}
      </span>
    ),
  },
  {
    title: "扫码状态",
    dataIndex: "auth_state",
    render: (record) => (
      <span
        className={record ? "scan-type scan-success" : "scan-type scan-fail"}
      >
        {record ? "扫码成功" : "扫码失败"}
      </span>
    ),
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
  },
];

export const payColumns = [
  {
    title: "账号名称",
    dataIndex: "account",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "项目名称",
    dataIndex: "app_name",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "套餐名称",
    dataIndex: "package_name",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "订单数量",
    dataIndex: "order_num",
    render: (record) => <span>{record ? record : "0"}</span>,
  },
  {
    title: "支付金额",
    dataIndex: "pay_balance",
  },
  {
    title: "剩余金额",
    dataIndex: "sum_balance",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
  },
];

export const rechargeColumns = [
  {
    title: "充值用户",
    dataIndex: "account",
    render: (record) => <>{record ? record : "-"}</>,
  },
  {
    title: "数量",
    dataIndex: "num",
  },
  {
    title: "余额",
    dataIndex: "balance",
    render: (record) => <>{record ? record : "-"}</>,
  },
  {
    title: "订单号",
    dataIndex: "order_id",
  },
  {
    title: "充值金额",
    dataIndex: "money",
  },
  {
    title: "状态",
    dataIndex: "status",
    render: (record) => (
      <>
        {record === -1
          ? "全部"
          : record === 1
          ? "成功"
          : record === 0
          ? "支付中"
          : "-"}
      </>
    ),
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
  },
];

export const processColumns = [
  {
    title: "发布人账号",
    dataIndex: "account",
  },
  {
    title: "提交时间",
    dataIndex: "create_time",
  },
  {
    title: "充值金额USDT",
    dataIndex: "money",
  },
];

export const projectColumns = [
  {
    title: "项目名称",
    width: 200,
    dataIndex: "app_name",
  },
  // {
  //   title: "日卡老号",
  //   dataIndex: "distribution_price0",
  // },
  {
    title: "日卡新号",
    dataIndex: "distribution_price1",
  },
  {
    title: "周卡",
    dataIndex: "distribution_price2",
  },
  {
    title: "月卡",
    dataIndex: "distribution_price3",
  },
  // {
  //   title: "信用分300",
  //   dataIndex: "distribution_price4",
  // },
  // {
  //   title: "30天回归",
  //   dataIndex: "distribution_price4",
  // },
  // {
  //   title: "CK",
  //   dataIndex: "distribution_price5",
  // },
  // {
  //   title: "open",
  //   dataIndex: "distribution_price6",
  // },
  // {
  //   title: "15级号",
  //   dataIndex: "distribution_price7",
  // },
  // {
  //   title: "21级号",
  //   dataIndex: "distribution_price8",
  // },
  // {
  //   title: "15W豆",
  //   dataIndex: "distribution_price9",
  // },
];

export const groupColumns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "分组名称",
    dataIndex: "group_name",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
  },
];

export const userListColumns = [
  {
    title: "账号",
    dataIndex: "account",
  },
  {
    title: "权限",
    dataIndex: "permissions",
    render: (record) => (
      <div>
        {record === 0 && "超级管理员"}
        {record === 1 && "销售"}
        {record === 2 && "普通用户"}
      </div>
    ),
  },
  {
    title: "是否禁用",
    dataIndex: "disable",
    render: (record) => (
      <div>
        {record === 0 && "正常"}
        {record === 1 && "禁用"}
      </div>
    ),
  },
  {
    title: "余额",
    dataIndex: "balance",
  },
  {
    title: "创建时间",
    width: 200,
    dataIndex: "create_time",
  },
];

export const priceManageColumns = [
  {
    title: "账号",
    dataIndex: "account",
  },
  {
    title: "项目名称",
    dataIndex: "price_name",
  },
  {
    title: "套餐",
    dataIndex: "pack_name",
  },
  {
    title: "类型",
    dataIndex: "type",
    render: (record) => (
      <div>
        {record === 0 && "全部"}
        {record === 1 && "PC"}
        {record === 2 && "Open"}
        {record === 3 && "Ck"}
      </div>
    ),
  },
  {
    title: "套餐价格",
    dataIndex: "price",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
  },
];

export const orderColumns = [
  {
    title: "订单ID",
    dataIndex: "id",
  },
  {
    title: "用户",
    dataIndex: "account",
  },
  {
    title: "项目名字",
    width: 120,
    dataIndex: "appName",
  },
  {
    title: "项目ID",
    width: 160,
    dataIndex: "appId",
  },
  {
    title: "订单号",
    width: 360,
    dataIndex: "orderId",
  },
  {
    title: "套餐",
    dataIndex: "packageName",
    render: (record) => <span>{record ? record : "--"}</span>,
  },
  {
    title: "分组",
    dataIndex: "group_name",
    render: (record) => <span>{record ? record : "--"}</span>,
  },
  {
    title: "投保",
    dataIndex: "isInsure",
    render: (record) => <span>{record === 1 ? "已投保" : "未投保"}</span>,
  },
  {
    title: "倍数",
    dataIndex: "number",
    render: (record) => <span>{record ? record : "--"}</span>,
  },
  {
    title: "投保金额",
    dataIndex: "insurePrice",
    render: (record) => <span>{record ? record : "--"}</span>,
  },
  {
    title: "创建时间",
    width: 200,
    dataIndex: "createTime",
  },
  {
    title: "到期时间",
    width: 200,
    dataIndex: "expiresTime",
    render: (record) => (
      <span>
        {record ? dayjs(record * 1000).format("YYYY-MM-DD HH:mm:ss") : "-"}
      </span>
    ),
  },
  {
    title: "更新时间",
    width: 200,
    dataIndex: "updateTime",
  },
];

export const kamiColumns = [
  {
    title: "购买用户",
    dataIndex: "user_account",
  },
  {
    title: "使用用户",
    dataIndex: "use_account",
  },
  {
    title: "卡密",
    dataIndex: "card",
  },
  {
    title: "充值金额",
    dataIndex: "money",
  },
  {
    title: "购买时间",
    width: 160,
    dataIndex: "create_time",
  },
  {
    title: "使用时间",
    width: 160,
    dataIndex: "use_time",
  },
];
export const incomeColumns = [
  {
    title: "用户名称",
    dataIndex: "account",
  },
  {
    title: "用户名称",
    dataIndex: "incone_account",
  },
  {
    title: "充值时间",
    dataIndex: "create_time",
  },
  {
    title: "充值金额",
    dataIndex: "money",
  },
  {
    title: "返利金额",
    dataIndex: "incone",
  },
];
