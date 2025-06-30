import React, { useRef, useEffect, useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 200;
const BOX_MARGIN = 2;

class NumberBox {
  constructor(num, width, x, y, color = 'grey') {
    this.num = num;
    this.width = width;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.num);
    ctx.fillStyle = 'black';
    ctx.fillText(this.num, this.x + this.width / 2, this.y + this.num / 2);
  }
}

export default function SelectionSortCanvas({ array, resetTrigger, arrayLength }) {
  const canvasRef = useRef(null);
  const nums = useRef([]);
  const tokens = useRef([]);
  const currTokenIndex = useRef(0);
  const [fps, setFps] = useState(5);
  const fpsRef = useRef(fps);

  useEffect(() => {
    fpsRef.current = fps;
  }, [fps]);
  const selectionSort = (arr, tokenList) => {
    
    let minIndex = 0;
    let sorted = 0;
    while(sorted < arr.length - 1){
        minIndex = sorted;
        for(var i = sorted + 1; i < arr.length; i++) {
            let prevMinIndex = 0;
            if(arr[i] < arr[minIndex]) {
                prevMinIndex = minIndex;
                minIndex = i;
            }
            tokenList.push({checked: i, minIndex: minIndex, swapped: [], sorted: sorted});
        }
        [arr[sorted], arr[minIndex]] = [arr[minIndex], arr[sorted]];
        tokenList.push({checked: i, minIndex: minIndex, swapped: [sorted, minIndex], sorted: sorted});

        sorted++;
    }
    tokenList.push({checked: i, minIndex: minIndex, swapped: [sorted, minIndex], sorted: arr.length});
    console.log(tokenList.length)
    return  
    }
  // const quickSort = (arr, start, end, tokenList) => {
  //   if (start >= end) return;
  //   let partition = end;
  //   let i = start - 1;
  //   for (let j = start; j <= end; j++) {
  //     if (arr[j] < arr[partition]) {
  //       i++;
  //       tokenList.push({ checked: [i, j], swapped: [i, j], partition });
  //       [arr[i], arr[j]] = [arr[j], arr[i]];
  //     } else {
  //       tokenList.push({ checked: [i + 1, j], swapped: [], partition });
  //     }
  //   }
  //   i++;
  //   tokenList.push({ checked: [], swapped: [i, partition], partition });
  //   [arr[i], arr[partition]] = [arr[partition], arr[i]];
  //   quickSort(arr, start, i - 1, tokenList);
  //   quickSort(arr, i + 1, end, tokenList);
  // };

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
    selectionSort(localArray, localTokens);

    tokens.current = localTokens;
    currTokenIndex.current = 0;
  }, [resetTrigger, array, arrayLength]);

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
            if(prev.checked < nums.current.length) nums.current[prev.checked].color = 'grey';
            prev.swapped.forEach((i) => (nums.current[i].color = 'grey'));
            nums.current[prev.minIndex].color = 'grey';
            
          }

          

          if (token.swapped.length) {
            const [i, j] = token.swapped;
            [nums.current[i].num, nums.current[j].num] = [
              nums.current[j].num,
              nums.current[i].num,
            ];
            nums.current[i].color = 'blue';
            nums.current[j].color = 'blue';
          }
          if(token.checked < nums.current.length) nums.current[token.checked].color = 'red';
          
          nums.current[token.minIndex].color = 'blue';

          for(let i = 0; i < token.sorted; i++) {
            nums.current[i].color = 'green';
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
