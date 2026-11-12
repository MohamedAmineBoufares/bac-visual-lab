import "./index.css";
import { mount } from "./mount";

const root = document.getElementById("root");
if (!root) throw new Error("#root missing in index.html");
await mount(root);
