(function () {
  'use strict';

  var fcData = [
    {
      id: "administrative",
      label: "Administrative Area",
      icon: "business",
      rooms: [
        {no:"101", type:"Faculty Room", area:"53.84"},
        {no:"101-1", type:"Cabin for Head of Dept", area:"20"},
        {no:"104", type:"Exam Control Office", area:"31.88"},
        {no:"104-1", type:"Cabin for Head of Dept", area:"25"},
        {no:"104-2", type:"Cabin for Head of Dept", area:"25"},
        {no:"117", type:"Office All Inclusive", area:"162.5"},
        {no:"120(A)", type:"Housekeeping", area:"20"},
        {no:"130", type:"Faculty Room", area:"84.54"},
        {no:"131", type:"Principal Directors Office", area:"30.24"},
        {no:"131(A)", type:"Cabin for Head of Dept", area:"25"},
        {no:"133", type:"Pantry for Staff", area:"13.33"},
        {no:"136", type:"Board Room", area:"44.54"},
        {no:"203", type:"Faculty Room", area:"17.65"},
        {no:"204", type:"Placement Office", area:"37.65"},
        {no:"A001", type:"Faculty Room", area:"48.02"},
        {no:"A002", type:"Cabin for Head of Dept", area:"15.02"},
        {no:"G01", type:"Cabin for Head of Dept", area:"53.84"},
        {no:"G11", type:"Central Store", area:"31.21"},
        {no:"G12", type:"Security", area:"11.2"},
        {no:"G13", type:"Maintenance", area:"12.1"}
      ]
    },
    {
      id: "amenities",
      label: "Amenities Area",
      icon: "deck",
      rooms: [
        {no:"111", type:"Toilet", area:"12.15"},
        {no:"112", type:"Toilet", area:"12.15"},
        {no:"114", type:"Stationery Store", area:"12.15"},
        {no:"121", type:"Toilet", area:"26.48"},
        {no:"132", type:"Toilet", area:"28.8"},
        {no:"133", type:"Toilet", area:"13.33"},
        {no:"204", type:"Student Activity / GCR", area:"17.65"},
        {no:"205", type:"Toilet", area:"12.15"},
        {no:"206", type:"Toilet", area:"12.15"},
        {no:"A003", type:"Auditorium", area:"218.25"},
        {no:"A01Gt2", type:"Toilet", area:"12.15"},
        {no:"A01Gtph", type:"Toilet", area:"14.25"},
        {no:"A02Gt1", type:"Toilet", area:"12.15"},
        {no:"A07Lt1", type:"Toilet", area:"12.15"},
        {no:"A07Ltph", type:"Toilet", area:"14.25"},
        {no:"A08Lt2", type:"Toilet", area:"12.15"},
        {no:"B111", type:"Boys Common Room", area:"80.5"},
        {no:"Bh", type:"Boys' Hostel", area:"889.1"},
        {no:"C112", type:"Cafeteria", area:"162.5"},
        {no:"C212", type:"Cafeteria", area:"80.25"},
        {no:"G09(A)", type:"First Aid cum Sick Room", area:"12.15"},
        {no:"G11", type:"Toilet", area:"12.5"},
        {no:"G111", type:"Girls Common Room", area:"80.5"},
        {no:"G12", type:"Toilet", area:"12.5"},
        {no:"Gh", type:"Girls' Hostel", area:"1412.4"}
      ]
    },
    {
      id: "instructional",
      label: "Instructional Area",
      icon: "school",
      rooms: [
        {no:"106", type:"Classroom", area:"79.71"},
        {no:"107", type:"Classroom", area:"81.88"},
        {no:"108", type:"Classroom", area:"60.39"},
        {no:"109", type:"Classroom", area:"60.39"},
        {no:"110", type:"Classroom", area:"53.84"},
        {no:"113", type:"Classroom", area:"81.29"},
        {no:"114", type:"Classroom", area:"81.29"},
        {no:"115", type:"Classroom", area:"81.29"},
        {no:"116", type:"Laboratory", area:"79.71"},
        {no:"117", type:"Laboratory", area:"81.88"},
        {no:"118", type:"Laboratory", area:"68.88"},
        {no:"119", type:"Laboratory", area:"51.7"},
        {no:"123", type:"Classroom", area:"48.03"},
        {no:"124", type:"Classroom", area:"56.11"},
        {no:"125", type:"Classroom", area:"56.11"},
        {no:"126", type:"Classroom", area:"56.11"},
        {no:"127", type:"Classroom", area:"56.11"},
        {no:"128", type:"Workshop", area:"153.84"},
        {no:"129", type:"Additional Workshop", area:"153.84"},
        {no:"201", type:"Classroom", area:"53.65"},
        {no:"201A", type:"Classroom", area:"79.71"},
        {no:"202", type:"Classroom", area:"53.65"},
        {no:"202A", type:"Classroom", area:"79.71"},
        {no:"206", type:"Classroom", area:"53.65"},
        {no:"207", type:"Classroom", area:"53.65"},
        {no:"209", type:"Laboratory", area:"81.29"},
        {no:"210", type:"Classroom", area:"81.29"},
        {no:"211", type:"Classroom", area:"81.29"},
        {no:"212", type:"Classroom", area:"81.29"},
        {no:"213", type:"Workshop", area:"81.29"},
        {no:"213(A)", type:"Additional Workshop", area:"81.29"},
        {no:"214", type:"Classroom", area:"68.89"},
        {no:"214-1", type:"Laboratory", area:"81.29"},
        {no:"215", type:"Classroom", area:"68.89"},
        {no:"216", type:"Laboratory", area:"81.29"},
        {no:"219", type:"Laboratory", area:"81.29"},
        {no:"220", type:"Laboratory", area:"53.69"},
        {no:"221", type:"Classroom", area:"53.65"},
        {no:"222", type:"Laboratory", area:"153"},
        {no:"223", type:"Laboratory", area:"153"},
        {no:"223-1", type:"Laboratory", area:"153"},
        {no:"224", type:"CAD Center", area:"153.84"},
        {no:"225", type:"Seminar Hall", area:"530"},
        {no:"A002", type:"Classroom", area:"75.02"},
        {no:"AC06", type:"Classroom", area:"71.8"},
        {no:"A007", type:"Classroom", area:"75.02"},
        {no:"A008", type:"Classroom", area:"48.02"},
        {no:"A101", type:"Tutorial Room", area:"48.02"},
        {no:"A102", type:"Tutorial Room", area:"74.59"},
        {no:"A103", type:"Tutorial Room", area:"76.51"},
        {no:"A106", type:"Classroom", area:"71.8"},
        {no:"Corri", type:"Other", area:"496"},
        {no:"G02", type:"Laboratory", area:"66.38"},
        {no:"G03", type:"Laboratory", area:"66.38"},
        {no:"G04", type:"Laboratory", area:"81.88"},
        {no:"G05", type:"Laboratory", area:"79.71"},
        {no:"G06", type:"Laboratory", area:"79.71"},
        {no:"G07", type:"Laboratory", area:"81.88"},
        {no:"G08", type:"Laboratory", area:"66.38"},
        {no:"G09", type:"Laboratory", area:"66.38"},
        {no:"G10", type:"Laboratory", area:"53.84"},
        {no:"G103", type:"Laboratory", area:"81.29"},
        {no:"G104", type:"Laboratory", area:"81.29"},
        {no:"G105", type:"Laboratory", area:"81.29"},
        {no:"G106", type:"Laboratory", area:"81.29"},
        {no:"G13", type:"Laboratory", area:"79.71"},
        {no:"Nb101", type:"Laboratory", area:"81.29"},
        {no:"Nb102", type:"Laboratory", area:"81.29"},
        {no:"Nb103", type:"Laboratory", area:"81.29"},
        {no:"Nb104", type:"Laboratory", area:"81.29"},
        {no:"Nb105", type:"Laboratory", area:"81.29"},
        {no:"Nb106", type:"Laboratory", area:"81.29"},
        {no:"Nb107", type:"Laboratory", area:"81.29"},
        {no:"Nb108", type:"Laboratory", area:"81.29"},
        {no:"Nb121", type:"CAD Center", area:"148.25"},
        {no:"Ncorri", type:"Other", area:"161"},
        {no:"Parkin", type:"Other", area:"862.72"},
        {no:"Upsrom", type:"Other", area:"6.5"}
      ]
    },
    {
      id: "common",
      label: "Instructional Area - Common Facilities",
      icon: "layers",
      rooms: [
        {no:"102", type:"Computer Center", area:"60.39"},
        {no:"103", type:"Computer Center", area:"60.39"},
        {no:"105", type:"Library & Reading Room", area:"79.71"},
        {no:"112", type:"Language Laboratory", area:"81.29"},
        {no:"116", type:"Language Laboratory", area:"81.29"},
        {no:"120", type:"Computer Center", area:"92.9"},
        {no:"224", type:"Library & Reading Room", area:"348.9"}
      ]
    }
  ];

  function getRoomIcon(type) {
    var t = type.toLowerCase();
    if (t.indexOf("laboratory") !== -1 || t.indexOf("lab") !== -1) return "science";
    if (t.indexOf("classroom") !== -1 || t.indexOf("class") !== -1) return "meeting_room";
    if (t.indexOf("workshop") !== -1) return "handyman";
    if (t.indexOf("toilet") !== -1) return "wc";
    if (t.indexOf("hostel") !== -1) return "hotel";
    if (t.indexOf("cafeteria") !== -1 || t.indexOf("canteen") !== -1) return "restaurant";
    if (t.indexOf("library") !== -1) return "local_library";
    if (t.indexOf("auditorium") !== -1) return "theater_comedy";
    if (t.indexOf("computer") !== -1) return "computer";
    if (t.indexOf("seminar") !== -1) return "event";
    if (t.indexOf("faculty") !== -1) return "badge";
    if (t.indexOf("cabin") !== -1 || t.indexOf("office") !== -1) return "desk";
    if (t.indexOf("board room") !== -1) return "groups";
    if (t.indexOf("placement") !== -1) return "work";
    if (t.indexOf("pantry") !== -1) return "coffee";
    if (t.indexOf("store") !== -1) return "inventory_2";
    if (t.indexOf("security") !== -1) return "security";
    if (t.indexOf("maintenance") !== -1) return "build";
    if (t.indexOf("housekeeping") !== -1) return "cleaning_services";
    if (t.indexOf("first aid") !== -1 || t.indexOf("sick") !== -1) return "local_hospital";
    if (t.indexOf("common room") !== -1) return "diversity_3";
    if (t.indexOf("stationery") !== -1) return "store";
    if (t.indexOf("exam") !== -1) return "assignment";
    if (t.indexOf("principal") !== -1) return "account_balance";
    if (t.indexOf("tutorial") !== -1) return "school";
    if (t.indexOf("cad") !== -1) return "draw";
    if (t.indexOf("student activity") !== -1) return "sports_esports";
    if (t.indexOf("language") !== -1) return "translate";
    return "room";
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(s || ""));
    return d.innerHTML;
  }

  function buildTabs() {
    var html = '';
    fcData.forEach(function(cat, i) {
      html += '<button type="button" class="fc-tab' + (i === 0 ? ' fc-tab-active' : '') + '" data-fc-tab="' + cat.id + '">' +
        '<span class="material-symbols-outlined">' + cat.icon + '</span>' +
        escapeHtml(cat.label) +
        ' <span class="fc-tab-count">' + cat.rooms.length + '</span>' +
        '</button>';
    });
    return html;
  }

  function buildTable(cat) {
    var total = 0;
    var rows = "";
    cat.rooms.forEach(function(r) {
      var area = parseFloat(r.area) || 0;
      total += area;
      var icon = getRoomIcon(r.type);
      rows += '<tr>' +
        '<td><span class="fc-room-no">' + escapeHtml(r.no) + '</span></td>' +
        '<td><span class="fc-room-type"><span class="material-symbols-outlined fc-room-icon">' + icon + '</span>' + escapeHtml(r.type) + '</span></td>' +
        '<td>' + r.area + '</td>' +
        '</tr>';
    });
    return '<div class="fc-section-header">' +
      '<h2 class="fc-section-title"><span class="material-symbols-outlined" style="font-size:24px;vertical-align:middle;margin-right:8px;color:#0c6ea8;">' + cat.icon + '</span>' + escapeHtml(cat.label) + '</h2>' +
      '<span class="fc-section-count">' + cat.rooms.length + ' rooms \u00B7 ' + total.toFixed(2) + ' m\u00B2</span>' +
      '</div>' +
      '<div class="fc-table-wrap" data-fc-table="' + cat.id + '">' +
      '<table class="fc-table">' +
      '<thead><tr><th>Room No.</th><th>Room Type</th><th>Carpet Area (m\u00B2)</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '<tfoot><tr><td colspan="2">Total</td><td>' + total.toFixed(2) + ' m\u00B2</td></tr></tfoot>' +
      '</table></div>';
  }

  function updateStat(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function computeStats() {
    var totalRooms = 0, totalArea = 0;
    fcData.forEach(function(cat) {
      cat.rooms.forEach(function(r) {
        totalRooms++;
        totalArea += parseFloat(r.area) || 0;
      });
    });
    updateStat('fcTotalRooms', totalRooms);
    updateStat('fcTotalArea', totalArea.toFixed(0));
    updateStat('fcAdminRooms', fcData[0].rooms.length);
    var instructionalCount = fcData[2].rooms.length + fcData[3].rooms.length;
    updateStat('fcInstructionalRooms', instructionalCount);
  }

  function init() {
    computeStats();

    var tabsContainer = document.getElementById('fcTabs');
    var tablesContainer = document.getElementById('fcTablesContainer');

    if (!tabsContainer || !tablesContainer) return;

    tabsContainer.innerHTML = buildTabs();

    var tablesHtml = '';
    fcData.forEach(function(cat) {
      tablesHtml += buildTable(cat);
    });
    tablesContainer.innerHTML = tablesHtml;

    // Show first tab by default
    var allTableWraps = tablesContainer.querySelectorAll('.fc-table-wrap');
    allTableWraps.forEach(function(t, i) {
      t.style.display = i === 0 ? '' : 'none';
    });
    setTimeout(function() {
      var firstTable = tablesContainer.querySelector('.fc-table-wrap');
      if (firstTable) firstTable.classList.add('fc-table-visible');
    }, 300);

    // Tab switching
    var tabs = tabsContainer.querySelectorAll('.fc-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var id = this.getAttribute('data-fc-tab');

        tabs.forEach(function(t) {
          t.classList.toggle('fc-tab-active', t.getAttribute('data-fc-tab') === id);
        });

        allTableWraps.forEach(function(t) {
          var show = t.getAttribute('data-fc-table') === id;
          t.style.display = show ? '' : 'none';
          if (show) {
            setTimeout(function() { t.classList.add('fc-table-visible'); }, 50);
          } else {
            t.classList.remove('fc-table-visible');
          }
        });

        var header = tablesContainer.querySelector('.fc-section-header');
        if (header && window.innerWidth < 768) {
          setTimeout(function() {
            header.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      });
    });

    // Animate stats on scroll
    var statCards = document.querySelectorAll('.fc-stat-card');
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fc-stat-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      statCards.forEach(function(c) { obs.observe(c); });
    } else {
      statCards.forEach(function(c) { c.classList.add('fc-stat-visible'); });
    }
  }

  init();
})();
