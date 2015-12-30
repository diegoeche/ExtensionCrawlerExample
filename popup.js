function getInnerHtml(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
      callback(response);
    });
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function fail() {
  renderStatus("Page doesn't contain a LinkedIn Profile");
  $("#result").hide();
}

var DOM;
document.addEventListener('DOMContentLoaded', function() {
  getInnerHtml(function(dom) {
    var dom = $(dom);
    DOM = $(dom);
    try {
      var name = dom.find(".full-name").text();
      var company = dom.find("#overview-summary-current td").text();
      var currentRole = dom.find(".current-position h4").first().text();
      var startedCurrentCompany = dom.find(".current-position .experience-date-locale time").first().text().match(/\d+/)[0];
      var startedWorking = dom.find(".past-position time").last().text().match(/\d+/)[0];

      var allInfoPresent = true;

      [name, company, currentRole, startedCurrentCompany, startedWorking].forEach(function (element) { allInfoPresent = allInfoPresent && element !== null });

      console.info(allInfoPresent);
      if(allInfoPresent) {
        $("#fullname").text(name);
        $("#current-company").text(company);
        $("#current-role").text(currentRole);
        $("#current-role-date").text(startedCurrentCompany);
        $("#first-role-date").text(startedWorking);
      } else {
        fail();
      }
    } catch(e) {
      fail();
    }
  });
});
