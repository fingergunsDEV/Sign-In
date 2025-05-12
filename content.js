// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_PAGE') {
    const pageData = analyzePage();
    sendResponse(pageData);
  }
  return true;
});

function analyzePage() {
  return {
    title: document.title,
    description: getMetaDescription(),
    headers: getHeadersStructure(),
    links: getLinksAnalysis()
  };
}

function getMetaDescription() {
  const metaDesc = document.querySelector('meta[name="description"]');
  return metaDesc ? metaDesc.getAttribute('content') : '';
}

function getHeadersStructure() {
  const headers = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  return headers.map(h => ({
    level: h.tagName.toLowerCase(),
    text: h.textContent.trim()
  }));
}

function getLinksAnalysis() {
  const links = [...document.querySelectorAll('a')];
  return links.map(link => ({
    text: link.textContent.trim(),
    href: link.href,
    isInternal: link.href.includes(window.location.hostname)
  }));
}