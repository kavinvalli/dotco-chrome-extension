document.getElementById("year").innerHTML = new Date().getFullYear();
console.log("running now", new Date().getMinutes(), new Date().getSeconds());

const apiKeyKey = "DOTCO_AIRTABLE_API_KEY";
const baseIdKey = "DOTCO_AIRTABLE_BASE_ID";
const tableNameKey = "DOTCO_AIRTABLE_TABLE_NAME";
const mainDomainKey = "DOTCO_MAIN_DOMAIN";

chrome.storage.sync.get(
  [apiKeyKey, baseIdKey, tableNameKey, mainDomainKey],
  (result) => {
    if (!result[apiKeyKey]) {
      setup();
    } else {
      createForm(
        result[apiKeyKey],
        result[baseIdKey],
        result[tableNameKey],
        result[mainDomainKey]
      );
    }
  }
);

function setup() {
  document.getElementById("setup").classList.remove("hidden");
  document.getElementById("create").classList.add("hidden");

  document.getElementById("setup").addEventListener("submit", (e) => {
    e.preventDefault();
    const apiKey = document.getElementById(apiKeyKey).value;
    const baseId = document.getElementById(baseIdKey).value;
    const tableName = document.getElementById(tableNameKey).value;
    const mainDomain = document.getElementById(mainDomainKey).value;
    chrome.storage.sync.set(
      {
        [apiKeyKey]: apiKey,
        [baseIdKey]: baseId,
        [tableNameKey]: tableName,
        [mainDomainKey]: mainDomain,
      },
      function () {
        console.log("Settings saved");
        document.getElementById("setup").classList.add("hidden");
        document.getElementById("create").classList.remove("hidden");
        createForm(apiKey, baseId, tableName, mainDomain);
      }
    );
  });
}

function createForm(apiKey, baseId, tableName, mainDomain) {
  document.getElementById("create").addEventListener("submit", (e) => {
    e.preventDefault();
    showLoader();
    const [slug, target] = [
      document.getElementById("slug").value,
      document.getElementById("url").value,
    ];
    chrome.runtime.sendMessage(
      {
        message: "createShortlink",
        [apiKeyKey]: apiKey,
        [baseIdKey]: baseId,
        [tableNameKey]: tableName,
        [mainDomainKey]: mainDomain,
        slug,
        target,
      },
      (res) => {
        console.log(res);
        hideLoader();
        if (res.success) {
          showSuccess(mainDomain, slug);
        } else {
          showError(res.error);
        }
      }
    );
  });

  document.getElementById("use-current-url").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      document.getElementById("url").value = url;
    });
  });
}

function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("create").classList.add("hidden");
}

function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("create").classList.remove("hidden");
  document.getElementById("slug").value = "";
  document.getElementById("url").value = "";
}

function showSuccess(mainDomain, slug) {
  document.getElementById(
    "created-shortlink"
  ).innerHTML = `${mainDomain}/${slug}`;
  document.getElementById("success").classList.remove("hidden");
}

function showSuccess(error) {
  document.getElementById("error-text").innerHTML = error;
  document.getElementById("error").classList.remove("hidden");
}
