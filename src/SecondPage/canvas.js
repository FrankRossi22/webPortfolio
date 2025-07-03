import React, { useRef, useEffect, useState } from 'react';
import useWindowDimensions from './windowDimensions';



let CANVAS_HEIGHT = 200;
let CANVAS_WIDTH = 800;
const BOX_MARGIN = 2;

class NumberBox {
  constructor(num, width, x, y, color = 'grey') {
    this.num = num;
    this.width = width;
    this.x = x;
    this.y = y;
    this.color = color;
    this.yOffset = 0;
    this.fontSize = Math.floor(this.width);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.num);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    this.fontSize = Math.min(Math.floor(this.width), 16)

    ctx.font = this.fontSize + 'px Arial';
    if(this.num < 10) this.yOffset = 8 + this.num / 2;
    else this.yOffset = 0;
    if(this.width > 12) ctx.fillText(this.num, this.x + this.width / 2, this.y + this.num / 2 - this.yOffset);
  }
}

export default function BubbleSortCanvas({ array, resetTrigger, arrayLength }) {
  const { height, width } = useWindowDimensions();
  CANVAS_HEIGHT = height / 5;
  CANVAS_WIDTH = width * .6;
  if(width < 700) CANVAS_WIDTH = width * .8
  const canvasRef = useRef(null);
  const nums = useRef([]);
  const tokens = useRef([]);
  const currTokenIndex = useRef(0);
  const [fps, setFps] = useState(5);
  const fpsRef = useRef(fps);

  useEffect(() => {
    fpsRef.current = fps;
  }, [fps]);

  useEffect(() => {
    const boxWidth = (CANVAS_WIDTH - BOX_MARGIN * 2) / arrayLength;
    nums.current = array.map(
      (num, index) =>
        new NumberBox(
          num,
          boxWidth - BOX_MARGIN * 2,
          index * boxWidth + BOX_MARGIN * 2,
          50,
          'grey'
        )
    );

    const localArray = [...array];
    const localTokens = [];
    let swapped = true;
    let sorted = 0;

    while (swapped) {
      swapped = false;
      for (let i = 0; i < localArray.length - 1 - sorted; i++) {
        let j = i + 1;
        localTokens.push({ checking: [i, j], swapped: false, sorted: sorted });
        if (localArray[i] > localArray[j]) {
          [localArray[i], localArray[j]] = [localArray[j], localArray[i]];
          swapped = true;
          localTokens.push({ checking: [i, j], swapped: true, sorted: sorted });
        }
      }
      sorted++;
    }
    console.log(localTokens.length)
    tokens.current = localTokens;
    currTokenIndex.current = 0;
  }, [resetTrigger, array, arrayLength, width]);

  useEffect(() => {
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastTime = 0;
    let frameTimer = 0;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px Arial';

    const animate = (timeStamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      const frameInterval = 1000 / fpsRef.current;
      frameTimer += deltaTime;

      if (frameTimer > frameInterval) {
        frameTimer = 0;

        if (currTokenIndex.current < tokens.current.length) {
          const token = tokens.current[currTokenIndex.current];

          if (currTokenIndex.current > 0) {
            const prev = tokens.current[currTokenIndex.current - 1];

            prev.checking.forEach((i) => {
              // Only reset to grey if NOT in sorted range
              if (i < nums.current.length - prev.sorted) {
                nums.current[i].color = 'grey';
              } else {
                nums.current[i].color = 'green'; // sorted part
              }
            });
          }

          const [i, j] = token.checking;

          if (i < nums.current.length - token.sorted)
            nums.current[i].color = 'blue';
          if (j < nums.current.length - token.sorted)
            nums.current[j].color = 'blue';

          // Mark sorted elements at the end
          for (let k = nums.current.length - token.sorted; k < nums.current.length; k++) {
            nums.current[k].color = 'green';
          }

          if (token.swapped) {
            [nums.current[i].num, nums.current[j].num] = [
              nums.current[j].num,
              nums.current[i].num,
            ];
          }

          currTokenIndex.current++;
        }
      }

      nums.current.forEach((box) => box.draw(ctx));
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '1px solid black', marginBottom: '10px' }}
      ></canvas>
      <div>
        <label>
          Speed: {fps} FPS
          <input
            type="range"
            min="1"
            max="60"
            value={fps}
            onChange={(e) => setFps(parseInt(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
