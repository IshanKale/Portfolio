import React from "react";
import {
  SiCplusplus,
  SiPython,
  SiReact,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiMongodb,
  SiTailwindcss,
} from "react-icons/si";
import "./OrbitingAvatar.css";

const ICONS = [
  { icon: SiCplusplus, color: "#00599C" },
  { icon: SiPython, color: "#3776AB" },
  { icon: SiReact, color: "#61DAFB" },
  { icon: SiJavascript, color: "#F7DF1E" },
  { icon: SiTypescript, color: "#3178C6" },
  { icon: SiNodedotjs, color: "#339933" },
  { icon: SiMongodb, color: "#47A248" },
  { icon: SiTailwindcss, color: "#06B6D4" },
];

const OrbitingAvatar = ({ imageSrc }) => {
  return (
    <div className="orbiting-container">
      <div className="orbit-ring">
        {ICONS.map((Item, index) => {
          const angle = (index / ICONS.length) * 360;
          return (
            <div
              key={index}
              className="orbit-icon-wrapper"
              style={{
                "--angle": `${angle}deg`,
                color: Item.color,
              }}
            >
              <Item.icon className="orbit-icon" />
            </div>
          );
        })}
      </div>
      <div className="avatar-wrapper">
        <img src={imageSrc} alt="Ishan Kale" className="avatar-image" />
        <div className="avatar-glow"></div>
      </div>
    </div>
  );
};

export default OrbitingAvatar;
