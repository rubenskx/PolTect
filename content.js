// Check if the function is not already defined
if (typeof getMostUsedElems === "undefined") {
  const getMostUsedElems = () => {
    const allElements = [...document.getElementsByTagName("p")];
    const allText = allElements.map((el) => el.textContent);
    return allText;
  };

  // Get element and its text content (if any)
  getMostUsedElems();
}
