function throttle(func, delay = 1000) {
  let timer = null;

  return function () {
    const context = this;
    const args = arguments;

    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  };
}

function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// /* 文本导出 */name:文件名 data:数组（不可以包对象，包了就要转化成字符串） isStr:是string还是数组
const exportRaw = (name, data, isStr) => {
  let str = isStr ? data : data.join("\n");
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(str)
  );
  element.setAttribute("download", name);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const getResidueHeightByDOMRect = () => {
  const bodyHeight = document.body.offsetHeight; // 网页可见区域高 (包括边线的高)
  const tableBodyTop = document
    .getElementsByClassName("ant-table-body")[0]
    ?.getBoundingClientRect().top; // tableBody距离顶部距离
  const paginationHeight = 32 + 16 * 2; // 分页器高度(包括间距);
  const tabContentBottomPadding = 18; // tab子元素区域下padding
  const contentBottomPadding = 32; // content区域的底部padding
  const residueHeight =
    bodyHeight -
    tableBodyTop -
    paginationHeight -
    contentBottomPadding -
    tabContentBottomPadding;
  return residueHeight;
};

function isMobile() {
  // 获取屏幕宽度
  var screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // 设置一个阈值来区分手机和电脑屏幕宽度
  var mobileThreshold = 768; // 你可以根据需要调整阈值

  // 判断屏幕宽度是否小于阈值
  if (screenWidth < mobileThreshold) {
    return true; // 小于阈值，认为是手机
  } else {
    return false; // 大于阈值，认为是电脑
  }
}

module.exports = {
  exportRaw,
  getResidueHeightByDOMRect,
  throttle,
  debounce,
  isMobile,
};
