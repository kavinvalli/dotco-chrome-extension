chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "createShortlink") {
    fetch(
      `https://api.airtable.com/v0/${request["DOTCO_AIRTABLE_BASE_ID"]}/${request["DOTCO_AIRTABLE_TABLE_NAME"]}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${request["DOTCO_AIRTABLE_API_KEY"]}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            slug: request.slug,
            target: request.target,
          },
        }),
      }
    )
      .then((res) => {
        sendResponse({ success: res.ok });
      })
      .catch((err) => {
        sendResponse({ success: false, error: err.toString() });
      });
    return true;
  }
});
