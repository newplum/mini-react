function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
}

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

let nextWorkOfUnit = null;
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
}

function workLoop(deadline) {
  let timeRemainingGt1 = true;
  while (timeRemainingGt1 && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    timeRemainingGt1 = deadline.timeRemaining > 1;
  }

  requestIdleCallback(workLoop);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  for (const key in props) {
    if (key !== "children") {
      dom[key] = props[key];
    }
  }
}

function initChildLink(work) {
  const children = work.props.children;
  let preChild = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      parent: work,
      child: null,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      work.child = newWork;
    } else {
      preChild.sibling = newWork;
    }
    preChild = newWork;
  });
}

function performWorkOfUnit(work) {
  if (!work.dom) {
    // 创建dom
    const dom = (work.dom = createDom(work.type));

    work.parent.dom.append(dom);
    // 更新props
    updateProps(dom, work.props);
  }

  // 实现链表
  initChildLink(work);

  // 返回下一个节点

  if (work.child) {
    return work.child;
  }

  if (work.sibling) {
    return work.sibling;
  }

  return work.parent?.sibling;
}

requestIdleCallback(workLoop);

export default {
  render,
  createElement,
};
