import React, { useEffect, useRef, useState } from 'react';



const CANVAS_WIDTH  = 800;
const BASE_HEIGHT   = 400;            
const LEVEL_HEIGHT  = 120;            
const MAX_NUM       = 100;
const boxMargin     = 2;

class NumberBox {
  constructor(num, width, x, y, color = 'grey') {
    this.num   = num;
    this.width = width;
    this.x     = x;
    this.y     = y;
    this.color = color;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.num);
    ctx.fillStyle = 'black';
    ctx.fillText(this.num, this.x + this.width / 2, this.y + this.num / 2);
  }
}



export default function HeapSortCanvas({ array, resetTrigger, arrayLength }) {
  const canvasRef          = useRef(null);
  const nums               = useRef([]);
  const tokens             = useRef([]);
  const randomNumbersArray = useRef([]);
  const currTokenIndex     = useRef(0);

  const [fps, setFps] = useState(5);
  const fpsRef        = useRef(fps);


  useEffect(() => { fpsRef.current = fps; }, [fps]);

  
  useEffect(() => {
    
    const heapLevels   = Math.min(5, Math.floor(Math.log2(arrayLength)) + 1); 
    const canvasHeight = BASE_HEIGHT + heapLevels * LEVEL_HEIGHT;             
    const canvas       = canvasRef.current;
    canvas.width  = CANVAS_WIDTH;                                             
    canvas.height = canvasHeight;                                             

 
    randomNumbersArray.current = [...array];
    nums.current    = [];
    tokens.current  = [];
    currTokenIndex.current = 0;

    const boxWidth  = (CANVAS_WIDTH - boxMargin * 2) / arrayLength;

    randomNumbersArray.current.forEach((n, idx) => {
      nums.current.push(
        new NumberBox(
          n,
          boxWidth - boxMargin * 2,
          idx * boxWidth + boxMargin * 2,
          canvasHeight - 250,        // keep boxes at bottom regardless of height
          'grey'
        )
      );
    });

    /* -------- local helpers (same names) -------- */
    function swap(arr, i, j) {
      let t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    function heapify(arr, nodeIndex, arrLength, maxIndex) {
      let left  = nodeIndex * 2 + 1;
      let right = nodeIndex * 2 + 2;
      let largest = nodeIndex;

      if (left  <= maxIndex) {
        tokens.current.push({ swapped: [], checked: [left,  nodeIndex] });
        if (arr[left]  > arr[largest]) largest = left;
      }
      if (right <= maxIndex) {
        tokens.current.push({ swapped: [], checked: [right, nodeIndex] });
        if (arr[right] > arr[largest]) largest = right;
      }
      if (largest !== nodeIndex) {
        tokens.current.push({ swapped: [nodeIndex, largest], checked: [] });
        swap(arr, nodeIndex, largest);
        heapify(arr, largest, arrLength, maxIndex);
      }
    }
    function buildHeap(arr) {
      for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--)
        heapify(arr, i, arr.length, arr.length - 1);
    }
    function heapSort(arr) {
      buildHeap(arr);
      for (let end = arr.length - 1; end > 0; end--) {
        tokens.current.push({ swapped: [0, end], checked: [] });
        swap(arr, 0, end);
        heapify(arr, 0, arr.length, end - 1);
      }
    }

    heapSort(randomNumbersArray.current);
  }, [resetTrigger, array, arrayLength]);  

  /* ---------- drawing helpers ---------- */
  function drawNode(ctx, x, y, val, col) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'light' + col;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText(val, x, y + 2);
  }

  const MAX_DEPTH = 4; 

  function drawHeap(ctx, arr, idx, x, y, hSpace, vSpace, depth = 0) {
  if (idx >= arr.length || depth > MAX_DEPTH) return;

  drawNode(ctx, x - 4, y, arr[idx].num, arr[idx].color);

  const left  = idx * 2 + 1;
  const right = left + 1;

  const nextY = y + vSpace;
  if (depth < MAX_DEPTH) {
    if (left < arr.length) {
      const lx = x - hSpace;
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.lineTo(lx, nextY - 20);
      ctx.stroke();
      drawHeap(ctx, arr, left, lx, nextY, hSpace / 2, vSpace, depth + 1);
    }

    if (right < arr.length) {
      const rx = x + hSpace;
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.lineTo(rx, nextY - 20);
      ctx.stroke();
      drawHeap(ctx, arr, right, rx, nextY, hSpace / 2, vSpace, depth + 1);
    }
  }

  if (depth === MAX_DEPTH && (2 * idx + 1 < arr.length || 2 * idx + 2 < arr.length)) {
    ctx.beginPath();
    ctx.setLineDash([5, 5]); 
    ctx.arc(x, y + vSpace, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('...', x, y + vSpace);
  }
}

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px Arial';

    let lastTime   = 0;
    let frameTimer = 0;

    const animate = (ts) => {
      const delta = ts - lastTime;
      lastTime = ts;
      frameTimer += delta;

      if (frameTimer > 1000 / fpsRef.current) {
        frameTimer = 0;

        if (currTokenIndex.current < tokens.current.length) {
          const token = tokens.current[currTokenIndex.current];

          /* undo colours of previous token */
          if (currTokenIndex.current > 0) {
            const prev = tokens.current[currTokenIndex.current - 1];
            prev.checked .forEach(i => (nums.current[i].color = 'grey'));
            prev.swapped.forEach(i => (nums.current[i].color = 'grey'));
          }

          /* apply current token */
          if (token.swapped.length) {
            const [i, j] = token.swapped;
            [nums.current[i].num, nums.current[j].num] =
              [nums.current[j].num, nums.current[i].num];
            nums.current[i].color = nums.current[j].color = 'blue';
          }
          if (token.checked.length) {
            const [i, j] = token.checked;
            nums.current[i].color = nums.current[j].color = 'blue';
          }
          currTokenIndex.current++;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '16px Arial'; 

  drawHeap(ctx, nums.current, 0, canvas.width / 2, 60, 200, 100);
  nums.current.forEach(b => b.draw(ctx));
  requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);  

  
  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black', marginBottom: '10px' }}
      />
      <div>
        <label>
          Speed: {fps} FPS&nbsp;
          <input
            type="range"
            min="1"
            max="100"
            value={fps}
            onChange={e => setFps(parseInt(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
