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

function render(el, container) {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  const props = el.props;

  for (const key in props) {
    if (key !== "children") {
      dom[key] = props[key];
    }
  }

  const children = el.props.children;

  for (const child of children) {
    render(child, dom);
  }

  container.append(dom);
}

export default {
  render,
  createElement,
};
