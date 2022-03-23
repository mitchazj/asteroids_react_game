import "./styles.css";
import asteroid from "./asteroid.png";
import spaceship_image from "./spaceship.png";
import { useEffect, useState } from "react";

const MOON_SVG =
  "https://upload.wikimedia.org/wikipedia/commons/e/ee/Weather_icon_-_full_moon.svg";

const toPx = (v) => `${v}px`;
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function Spaceship({ top, left, size }) {
  const computedStyles = {
    top: toPx(top),
    left: toPx(left),
    width: toPx(size),
    position: "fixed"
  };
  return <img src={spaceship_image} alt="spaceship" style={computedStyles} />;
}

function Asteroid({ top, left, size }) {
  const computedStyles = {
    top: toPx(top),
    left: toPx(left),
    width: toPx(size),
    position: "fixed"
  };
  return <img src={asteroid} alt="asteroid" style={computedStyles} />;
}

function Moon() {
  return (
    <div>
      <img
        src={MOON_SVG}
        alt="moon"
        className="absolute top-8 left-12 h-32 w-32 yellow-filter"
      />
    </div>
  );
}

export default function App() {
  const [frameTime, setFrameTime] = useState(new Date());

  const [spaceship, setSpaceship] = useState({
    top: 0,
    left: 0,
    size: 80
  });

  const [asteroids, setAsteroids] = useState([]);

  const setupGame = () => {
    const new_asteroids = [];
    for (let i = 0; i < 60; ++i) {
      new_asteroids.push({
        top: getRandomArbitrary(-window.innerHeight, window.innerHeight),
        left: getRandomArbitrary(0, window.innerWidth),
        size: getRandomArbitrary(0, 64)
      });
    }
    setAsteroids(new_asteroids);
  };

  const moveAsteroids = () => {
    if (asteroids.length > 0) {
      const new_asteroids = [...asteroids];
      for (let i = 0; i < new_asteroids.length; ++i) {
        new_asteroids[i].top += 1.4;
        if (new_asteroids[i].top > window.innerHeight) {
          new_asteroids[i].top = -getRandomArbitrary(0, window.innerHeight);
          new_asteroids[i].left = getRandomArbitrary(0, window.innerWidth);
        }
      }
      setAsteroids(new_asteroids);
    } else {
      setupGame();
    }
  };

  const redrawAppScreen = () => {
    moveAsteroids();
    setFrameTime(new Date());
  };

  useEffect(() => {
    let nextEvent;

    const frame = () => {
      try {
        nextEvent = setTimeout(frame, 60);
        redrawAppScreen();
      } catch (e) {
        console.log("bugged out");
        clearTimeout(nextEvent);
      }
    };
    frame();

    return () => clearTimeout(nextEvent);
  }, []);

  return (
    <div className="bg-[#011522] min-h-screen">
      <div>
        <Moon />
        <Spaceship {...spaceship} />
        {asteroids.map((asteroid, i) => (
          <Asteroid {...asteroid} key={i} />
        ))}
        <div className="relative px-3 pt-2 text-white bold">
          {frameTime.getSeconds()} seconds,{" "}
          {asteroids.length > 0 ? asteroids[0].top : null}
        </div>
      </div>
    </div>
  );
}
