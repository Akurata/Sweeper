const express = require('express');
var app = express();

var fs = require('fs');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var request = require('request');

var zlib = require('zlib');
//const {gzip, ungzip} = require('node-gzip');

var response;
var count = [];
var pages = {};

var full;

var bigString = "";

app.use(bodyParser.urlencoded({extended: true}));

// /https://www.marist.edu/group/control_panel?doAsGroupId=20182&controlPanelCategory=current_site.pages&p_p_id=156
request('https://www.marist.edu/group/control_panel/manage?p_p_auth=vueVFykn&p_p_id=156&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&doAsGroupId=20182&refererPlid=136471&controlPanelCategory=current_site.pages&_156_struts_action=%2Fgroup_pages%2Fedit_layout', {
  encoding: null,
  credentials: 'same-origin',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryCFAcNuZ0wAmyodJy',
    'Cookie': '_ga=GA1.2.1926236814.1524590939; __atssc=google%3B2; optimizelyEndUserId=oeu1526935674701r0.1711954961244957; optimizelyBuckets=%7B%7D; __lotl=https%3A%2F%2Fwww.marist.edu%2Ffinancialaid%2Ffreshman%2F; __qca=P0-1242206474-1527262925872; optimizelySegments=%7B%22644590055%22%3A%22gc%22%2C%22647900038%22%3A%22false%22%2C%22649040063%22%3A%22referral%22%7D; CoreID6=11599975619515295193092&ci=50200000|IBM_Systems; CoreM_State=21~-1~-1~-1~-1~3~3~5~3~3~7~7~|~~|~~|~~|~||||||~|~~|~~|~~|~~|~~|~~|~~|~; CoreM_State_Content=6~|~~|~|; OPTOUTMULTI=0:0%7Cc1:1%7Cc2:0%7Cc3:0; utag_main=v_id:01641e7480a6006e50730e21fb0001071003106900bd0$_sn:2$_ss:0$_st:1529607272457$is_country_member_of_eu:false$ses_id:1529605219818%3Bexp-session$_pn:1%3Bexp-session$mm_sync:1%3Bexp-session; __atuvc=0%7C22%2C1%7C23%2C1%7C24%2C0%7C25%2C4%7C26; _hp2_id.2689279202=%7B%22userId%22%3A%228297616240820815%22%2C%22pageviewId%22%3A%225259180509788254%22%2C%22sessionId%22%3A%226240436162496734%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%224.0%22%7D; _gid=GA1.2.2134638660.1531142317; COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; COMPANY_ID=20155; ID=6168316a6c526452776a4a515133627450776e5930773d3d; USER_UUID=6465744f51564a3531313730623133783373423137574763504c54424d56753351304e416e54614f44614d3d; LOGIN=616b7572617461; PASSWORD=594c424174496b5668376f5632393558486f324761413d3d; REMEMBER_ME=true; SCREEN_NAME=45344a4a744d4f30464e6d543856794e4b4e6d6672513d3d; __utmz=220728263.1531248322.18.5.utmcsr=login.marist.edu|utmccn=(referral)|utmcmd=referral|utmcct=/cas/login; __unam=812b8ec-16397f6d330-b520d1c-14; JSESSIONID=8BD78B66310A4E6A21F71FFBCDD146C9; __utmc=220728263; __utma=220728263.1926236814.1524590939.1531487664.1531492103.24; _gat_gtag_UA_320870_1=1'
    },
  method: 'POST'
}, (err, res, body) => {
  if(res.headers['content-encoding'] == 'gzip') {
    zlib.gunzip(res.body, (err, dezip) => {
      console.log("Res recieved");

      if (err) console.log(err);
      //console.log(dezip.toString());
      response = dezip.toString();
      full = response;
      response = response.substring(response.indexOf("children:b.formatJSONResults") + 29, response.indexOf("),cssClasses:{pages:p"));

      var temp = response.split('');

      var startIndex = 0;
/*
      for(var i = 0; temp[i] != undefined; i++) {
        console.log(i)
        console.log(temp[i])

        if(temp[i] === '{' || temp[i] === ',') { //Add after quotes
          if(temp[i+1] !== '{') {
            temp.splice(i+1, 0, "\"");
          }
        }
        if(temp[i] === ':') { //Add before quotes
          temp.splice(i, 0, "\"");
          i++;
        }



        if((temp[i-1] === '}' && temp[i+1] === '{') || (temp[i+1] === undefined)) {
          var string = "";
          for(var j = startIndex; j < i; j++) {
            string += temp[j];
          }
          count.push(string);
          bigString += string;
          startIndex = i; //+1
        }


      }
*/

      var i = -1;
      do {
        i++;
        console.log(i)
        console.log(temp[i])

        if(temp[i] === '{' || temp[i] === ',') { //Add after quotes
          if(temp[i+1] !== '{') {
            temp.splice(i+1, 0, "\"");
          }
        }
        if(temp[i] === ':') { //Add before quotes
          temp.splice(i, 0, "\"");
          i++;
        }



        if((temp[i-1] === '}' && temp[i+1] === '{') || (temp[i+1] === undefined)) {
          var string = "";
          for(var j = startIndex; j < i; j++) {
            string += temp[j];
          }
          count.push(string);
          bigString += string;
          startIndex = i; //+1
        }
      }while (temp[i] != undefined);





      pages = temp //JSON.parse(temp.join(''));
      for(var i = 0; i < count.length; i++) {
        //pages[i] = JSON.parse(count[i]);
        //console.log(i)
      }

      for(var i = 0; i < count.length; i++) {

      }


      console.log(bigString)
    });
  } else {
    console.log(body)
  }
});


var reqTwo;
request('https://www.marist.edu/html/js/everything.jsp?browserId=other&themeId=controlpanel&colorSchemeId=01&minifierType=js&minifierBundleId=javascript.everything.files&languageId=en_US&b=6205&t=1452630614000', {
  encoding: null,
  credentials: 'same-origin',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryCFAcNuZ0wAmyodJy',
    'Cookie': '_ga=GA1.2.1926236814.1524590939; __atssc=google%3B2; optimizelyEndUserId=oeu1526935674701r0.1711954961244957; optimizelyBuckets=%7B%7D; __lotl=https%3A%2F%2Fwww.marist.edu%2Ffinancialaid%2Ffreshman%2F; __qca=P0-1242206474-1527262925872; optimizelySegments=%7B%22644590055%22%3A%22gc%22%2C%22647900038%22%3A%22false%22%2C%22649040063%22%3A%22referral%22%7D; CoreID6=11599975619515295193092&ci=50200000|IBM_Systems; CoreM_State=21~-1~-1~-1~-1~3~3~5~3~3~7~7~|~~|~~|~~|~||||||~|~~|~~|~~|~~|~~|~~|~~|~; CoreM_State_Content=6~|~~|~|; OPTOUTMULTI=0:0%7Cc1:1%7Cc2:0%7Cc3:0; utag_main=v_id:01641e7480a6006e50730e21fb0001071003106900bd0$_sn:2$_ss:0$_st:1529607272457$is_country_member_of_eu:false$ses_id:1529605219818%3Bexp-session$_pn:1%3Bexp-session$mm_sync:1%3Bexp-session; __atuvc=0%7C22%2C1%7C23%2C1%7C24%2C0%7C25%2C4%7C26; _hp2_id.2689279202=%7B%22userId%22%3A%228297616240820815%22%2C%22pageviewId%22%3A%225259180509788254%22%2C%22sessionId%22%3A%226240436162496734%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%224.0%22%7D; _gid=GA1.2.2134638660.1531142317; COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; COMPANY_ID=20155; ID=6168316a6c526452776a4a515133627450776e5930773d3d; USER_UUID=6465744f51564a3531313730623133783373423137574763504c54424d56753351304e416e54614f44614d3d; LOGIN=616b7572617461; PASSWORD=594c424174496b5668376f5632393558486f324761413d3d; REMEMBER_ME=true; SCREEN_NAME=45344a4a744d4f30464e6d543856794e4b4e6d6672513d3d; __utmz=220728263.1531248322.18.5.utmcsr=login.marist.edu|utmccn=(referral)|utmcmd=referral|utmcct=/cas/login; __unam=812b8ec-16397f6d330-b520d1c-14; JSESSIONID=8BD78B66310A4E6A21F71FFBCDD146C9; __utmc=220728263; __utma=220728263.1926236814.1524590939.1531487664.1531492103.24; _gat_gtag_UA_320870_1=1'
    },
  method: 'POST'
}, (err, res, body) => {
    if(res.headers['content-encoding'] == 'gzip') {
      zlib.gunzip(res.body, (err, dezip) => {
        console.log(dezip.toString())
        reqTwo = dezip.toString();
    })
  }
});






app.get('/', (req, res) => {
  res.json(JSON.parse(bigString));
  res.end();
});
app.get('/full', (req, res) => {
  res.send(reqTwo);
})

app.listen('3000', () => {
  console.log("Start");
});
