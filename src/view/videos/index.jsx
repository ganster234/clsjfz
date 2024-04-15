import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./index.less";
export default function Frequency() {
  const navigate = useNavigate();
  const enterInto = (val) => {
    window.open(val);
  };
  return (
    <ul className="ullist">
      <li>
        <Button
          style={{ marginBottom: "10px" }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <LeftOutlined />
        </Button>
      </li>
      <li className="nav">🚩上号/下单教程</li>
      <li>
        <strong>下单教程</strong>
        <p onClick={() => enterInto("https://pan.quark.cn/s/737ebadd175d")}>
          立即下载
        </p>
      </li>
      <li>
        <strong>微信下单小程序</strong>
        <p onClick={() => enterInto("https://pan.quark.cn/s/cca41094c597")}>
          立即下载
        </p>
      </li>
      <li>
        <strong>套餐QQ扫码open教程（上号）</strong>
        <p onClick={() => enterInto("https://pan.quark.cn/s/15b28cd74a8b")}>
          立即下载
        </p>
      </li>
      {/* <li>
        <strong>套餐QQ与微信扫码（上号）</strong>
        <p onClick={() => enterInto("https://pan.quark.cn/s/804e1109771f")}>
          立即下载
        </p>
      </li> */}
      <li>
        <strong>套餐QQ扫码真机与模拟器（上号）</strong>
        <p
          onClick={() =>
            enterInto("https://pan.quark.cn/s/5b521cb519c6#/list/share")
          }
        >
          立即下载
        </p>
      </li>
      <li>
        <strong>套餐微信扫码真机与模拟器（上号）</strong>
        <p
          onClick={() =>
            enterInto("https://pan.quark.cn/s/29883025ff99#/list/share")
          }
        >
          立即下载
        </p>
      </li>
      <li>
        <strong>IOS与多手机微信QQ扫码（上号）</strong>
        <p
          onClick={() =>
            enterInto("https://pan.quark.cn/s/0f0b425b1b2f#/list/share")
          }
        >
          立即下载
        </p>
      </li>
      <li className="nav">🚩联合套餐活动页面教程</li>
      <li>
        <strong>网页登录器教程(非专属项目无需下载)</strong>
        <p
          onClick={() =>
            enterInto("https://pan.quark.cn/s/d28185b618fb#/list/share")
          }
        >
          立即下载
        </p>
      </li>
      <li className="nav">🚩操作教程</li>
      {/* <li>
        <strong>教程文档（非视频）</strong>
        <p
          onClick={() =>
            enterInto("https://pan.quark.cn/s/53a195d935de#/list/share")
          }
        >
          立即下载
        </p>
      </li> */}
      <li>
        <strong>登录注册教程</strong>
        <p
          onClick={() =>
            enterInto("https://pan.quark.cn/s/fa85cd203f03#/list/share")
          }
        >
          立即下载
        </p>
      </li>
      {/* <li>
        <strong>使用教程</strong>
        <p onClick={() => enterInto("https://pan.quark.cn/s/64517e0f05f4")}>
          立即下载
        </p>
      </li> */}
      <li>
        <strong>基础使用教程（电脑端）</strong>
        <p onClick={() => enterInto("https://pan.quark.cn/s/0e721f59ef21#/list/share")}>
          立即下载
        </p>
      </li>
      <li>
        <strong>基础使用教程（手机端）</strong>
        <p onClick={() => enterInto("https://pan.quark.cn/s/de34afb025eb#/list/share")}>
          立即下载
        </p>
      </li>
      <li>
        <strong>USDT充值教程</strong>
        <p
          onClick={() =>
            enterInto("https://pan.quark.cn/s/583e76481d03#/list/share")
          }
        >
          立即下载
        </p>
      </li>
      <li className="nav">🚩API教程</li>
      <li>
        <strong>API下载使用</strong>
        <p
          onClick={() =>
            enterInto("https://pan.quark.cn/s/7f473844f9c0#/list/share")
          }
        >
          立即下载
        </p>
      </li>
      <li className="nav">🚩微信快手扫码上号教程</li>
      <li>
        <strong>微信快手使用教程（需要xposed框架）</strong>
        <p
          onClick={() =>
            // enterInto("https://pan.quark.cn/s/1c7ab463b249#/list/share")
            enterInto("https://pan.quark.cn/s/595e232ac85c#/list/share")
          }
        >
          立即下载
        </p>
      </li>
    </ul>
  );
}
