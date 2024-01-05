const injectContentScript = async (tab) => {
  try {
    const { id } = tab;
    const scriptResult = await chrome.scripting.executeScript({
      target: { tabId: id },
      files: ["content.js"],
    });
    return scriptResult[0].result;
  } catch (error) {
    console.warn(error);
    return undefined;
  }
};

const makeApiRequest = async (postData) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: postData,
      }),
    }); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error making API request:", error);
    return undefined;
  }
};

const setDOMInfo = async (paragraph) => {
  // Background Colors
  document.getElementById("x-box").style.display = "none";
  document.getElementById("labels").style.display = "none";
  // console.log("Hello used: ", paragraph);
  let totalNumber = 0;
  let left = (right = center = 0);
  let cur = "";
  for (para of paragraph) {
    cur += para;
    if (cur.length > 250) {
      const result = await makeApiRequest(cur);
      left += result.left;
      right += result.right;
      center += result.center;
      console.log(left, right, center);
      totalNumber++;
      cur = "";
    }
  }
  document.getElementById("spinner").style.display = "none";
  left = (left / totalNumber) * 100; // Convert to percentage
  right = (right / totalNumber) * 100; // Convert to percentage
  center = (center / totalNumber) * 100; // Convert to percentage

  let bias = "right";
  let prob = right;
  if (left > right && left > center) {
    bias = "left";
    prob = left;
  } else if (center > left && center > right) {
    bias = "center";
    prob = center;
  }

  if (prob > 60) {
    document.getElementById(
      "result"
    ).textContent = `The article is considered to be biased to extremely ${bias}.`;
  } else {
    document.getElementById(
      "result"
    ).textContent = `The article is considered to be biased to moderately ${bias}.`;
  }
  document.getElementById(
    "title"
  ).textContent = `Found ${totalNumber} paragraphs.`;

  var xBox = document.getElementById("x-box");

  if (xBox) {
    xBox.style.display = "block";
    //   console.log(`repeating-conic-gradient(
    // 	from 0deg,
    // 	#ff264a 0deg calc(3.6deg * ${left}),
    // 	#feec1e calc(3.6deg * ${left}) calc(3.6deg * ${left + center}),
    // 	#12CBC4 calc(3.6deg * ${left + center}) calc(3.6deg * 100)
    // )`);
    xBox.style.background = `repeating-conic-gradient(
		from 0deg,
		#1D267D 0deg calc(3.6deg * ${left}),
		#feec1e calc(3.6deg * ${left}) calc(3.6deg * ${left + center}),
		#ff264a calc(3.6deg * ${left + center}) calc(3.6deg * 100)
	)`;
  } else {
    console.error("Element with id 'x-box' not found.");
  }
  document.getElementById("labels").style.display = "block";
  document.getElementById("left").textContent = `Left - ${left.toFixed(2)}%, `;
  document.getElementById("center").textContent = `Center - ${center.toFixed(
    2
  )}%, `;
  document.getElementById("right").textContent = `Right - ${right.toFixed(
    2
  )}%.`;
};

window.addEventListener("DOMContentLoaded", () => {
  // Query for the active tab...
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    async (tabs) => {
      const scriptResult = await injectContentScript(tabs[0]);
      if (scriptResult) {
        setDOMInfo(scriptResult);
      }
    }
  );
});
