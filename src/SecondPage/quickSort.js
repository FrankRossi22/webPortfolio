import React, { useRef, useEffect, useState, useCallback } from 'react';
import useWindowDimensions from './windowDimensions';
let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 200;
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

export default function QuickSortCanvas({ array, resetTrigger, arrayLength }) {
  const { height, width } = useWindowDimensions();
  CANVAS_HEIGHT = Math.max(height / 5, 200);
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

  const quickSort = useCallback( (arr, start, end, tokenList) => {
    if (start >= end) return;
    let partition = end;
    let i = start - 1;
    for (let j = start; j <= end; j++) {
      if (arr[j] < arr[partition]) {
        i++;
        tokenList.push({ checked: [i, j], swapped: [i, j], partition });
        [arr[i], arr[j]] = [arr[j], arr[i]];
      } else {
        tokenList.push({ checked: [i + 1, j], swapped: [], partition });
      }
    }
    i++;
    tokenList.push({ checked: [], swapped: [i, partition], partition });
    [arr[i], arr[partition]] = [arr[partition], arr[i]];
    quickSort(arr, start, i - 1, tokenList);
    quickSort(arr, i + 1, end, tokenList);
  }, []);

  useEffect(() => {
    const boxWidth = (CANVAS_WIDTH - BOX_MARGIN * 2) / arrayLength;
    nums.current = array.map(
      (num, index) =>
        new NumberBox(
          num,
          boxWidth - BOX_MARGIN * 2,
          index * boxWidth + BOX_MARGIN * 2,
          30,
          'grey'
        )
    );

    const localArray = [...array];
    const localTokens = [];
    quickSort(localArray, 0, localArray.length - 1, localTokens);

    tokens.current = localTokens;
    currTokenIndex.current = 0;
  }, [resetTrigger, array, arrayLength, quickSort, width]);

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
            prev.checked.forEach((i) => (nums.current[i].color = 'grey'));
            prev.swapped.forEach((i) => (nums.current[i].color = 'grey'));
            nums.current[prev.partition].color = 'grey';
          }

          nums.current[token.partition].color = 'purple';

          if (token.swapped.length) {
            const [i, j] = token.swapped;
            [nums.current[i].num, nums.current[j].num] = [
              nums.current[j].num,
              nums.current[i].num,
            ];
            nums.current[i].color = 'orange';
            nums.current[j].color = 'blue';
          }

          if (token.checked.length) {
            const [i, j] = token.checked;
            nums.current[i].color = 'orange';
            nums.current[j].color = 'blue';
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
