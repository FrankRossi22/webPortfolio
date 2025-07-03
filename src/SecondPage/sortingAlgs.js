import React, { useState, useEffect } from 'react';
import BubbleSortCanvas from './canvas';
import QuickSortCanvas from './quickSort';
import './sorting.css';
import SelectionSortCanvas from './selectionSort';
import HeapSortCanvas from './heapSort';
import useWindowDimensions from './windowDimensions';
const MAX_NUM = 100;

export default function SortingAlgsPage() {
  const width = useWindowDimensions().width;
  const [arrayLength, setArrayLength] = useState(30);
  const [array, setArray] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);

  let isWideEnoughForHeap = width  > 1000;
  useEffect(() => {
    const newArray = Array.from({ length: arrayLength }, () =>
      Math.floor(Math.random() * MAX_NUM + 2)
    );
    setArray(newArray);
  }, [arrayLength, resetTrigger]);

  return (
    <div className="sortingAlgPageCont">
      <div className="SortingButtonCont">
  <div className="sortingControlLeft">
    <div>
      <label>
      Array Size: {arrayLength}
      
      </label>
    </div>
    <div>
      <input
          type="range"
          min="5"
          max="100"
          value={arrayLength}
          onChange={(e) => setArrayLength(parseInt(e.target.value))}
        />
    </div>
  </div>

  <div className="sortingControlCenter">
    <a href="/" className="backButton">
      Back To Portfolio
    </a>
  </div>

  <div className="sortingControlRight">
    <button onClick={() => setResetTrigger((prev) => !prev)}>
      🔁 Reset All Visualizers
    </button>
  </div>
</div>

      <div className="sortingAlgCont">
        <h1>Bubble Sort</h1>
        <BubbleSortCanvas
          array={array}
          resetTrigger={resetTrigger}
          arrayLength={arrayLength}
        />
      </div>

      

      <div className="sortingAlgCont">
        <h1>Selection Sort</h1>
        <SelectionSortCanvas
          array={array}
          resetTrigger={resetTrigger}
          arrayLength={arrayLength}
        />
      </div>

      <div className="sortingAlgCont">
        <h1>Quick Sort</h1>
        <QuickSortCanvas
          array={array}
          resetTrigger={resetTrigger}
          arrayLength={arrayLength}
        />
      </div>
      <div className="sortingAlgCont">
        <h1>Heap Sort</h1>
        {isWideEnoughForHeap ? (
        <HeapSortCanvas
          array={array}
          resetTrigger={resetTrigger}
          arrayLength={arrayLength}
        />
      ) : (
        <div>
        <p>Heap can't be rendered due to screen width limitations :(</p>
        <p>Try on a laptop or desktop to visualize HeapSort!</p>
        </div>
      )}
        
        
      </div>
    </div>
  );
}
