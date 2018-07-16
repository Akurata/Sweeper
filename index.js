const express = require('express');
var app = express();

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var request = require('request');
var async = require('async')

var zlib = require('zlib');
//const {gzip, ungzip} = require('node-gzip');

var response;
var count = [];
var pages = {};

var full;
var test = "";

var tree = "";

app.use(bodyParser.urlencoded({extended: true}));
// doAsGroupId=20182&controlPanelCategory=current_site.pages&p_p_id=156
// /https://www.marist.edu/group/control_panel?doAsGroupId=20182&controlPanelCategory=current_site.pages&p_p_id=156
request('https://www.marist.edu/group/control_panel/manage?doAsGroupId=20182&controlPanelCategory=current_site.pages&p_p_id=156', {
  encoding: null,
  credentials: 'same-origin',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryCFAcNuZ0wAmyodJy',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Cookie': '__utma=220728263.1974296480.1521576471.1526050319.1528481507.5; __utmz=220728263.1521576471.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; _ga=GA1.2.1974296480.1521576471; JSESSIONID=A0F3F5D9A128270594492EBC279B4538; _gid=GA1.2.1139722017.1531746938; LFR_SESSION_STATE_20159=1531752816621; COMPANY_ID=20155; ID=6168316a6c526452776a4a515133627450776e5930773d3d; USER_UUID=374652383144446d48454f78374c4f4a49384335425073376b58743249394d456e613965485362325475303d; LFR_SESSION_STATE_175775=expired; LOGIN=616b7572617461; PASSWORD=594c424174496b5668376f5632393558486f324761413d3d; REMEMBER_ME=true; SCREEN_NAME=45344a4a744d4f30464e6d543856794e4b4e6d6672513d3d'
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
      var i = -1;
      do {
        i++;
        if(temp[i] === '{' || temp[i] === ',') { //Add after quotes
          if(temp[i+1] !== '{' && temp[i+1] !== ' ') {
            temp.splice(i+1, 0, "\"");
          }
        }
        if(temp[i] === ':') { //Add before quotes
          if(temp[i + 1] !== " ") {
            temp.splice(i, 0, "\"");
          }
          i++;
        }

        if((temp[i-1] === '}' && temp[i+1] === '{') || (temp[i+1] === undefined)) {
          var string = "";
          for(var j = startIndex; j < i; j++) {
            string += temp[j];
          }
          count.push(string);
          tree += string;
          startIndex = i; //+1
        }
      }while (temp[i] != undefined);
      pages = temp //JSON.parse(temp.join(''));



      tree = JSON.parse(tree);
      fillBranch(tree.layouts);
    });
  } else {
    //console.log(body)
  }
});

function fillBranch(layouts) {
  async.forEachOf(layouts, (result, i, callback) => {
    if(layouts[i].hasChildren) {
      request('https://www.marist.edu/c/layouts_admin/get_layouts?cmd=get&doAsGroupId=20182&end=20&groupId=20182&incomplete=1&limit=20&p_auth=qVxIXONA&p_l_id=20176&p_p_id=88&parentLayoutId=' + layouts[i].layoutId + '&privateLayout=0&start=0&treeId=layoutsTree', {
        encoding: null,
        credentials: 'same-origin',
        headers: {
          'Host': 'www.marist.edu',
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://www.marist.edu/group/control_panel?refererPlid=20185&doAsGroupId=20182&controlPanelCategory=current_site.pages&p_p_id=156&_156_selPlid=137837',
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Content-Length': '224',
          'Cookie': '__utma=220728263.1974296480.1521576471.1526050319.1528481507.5; __utmz=220728263.1521576471.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; _ga=GA1.2.1974296480.1521576471; JSESSIONID=A0F3F5D9A128270594492EBC279B4538; _gid=GA1.2.1139722017.1531746938; LFR_SESSION_STATE_20159=1531752816621; COMPANY_ID=20155; ID=6168316a6c526452776a4a515133627450776e5930773d3d; USER_UUID=374652383144446d48454f78374c4f4a49384335425073376b58743249394d456e613965485362325475303d; LFR_SESSION_STATE_175775=expired; LOGIN=616b7572617461; PASSWORD=594c424174496b5668376f5632393558486f324761413d3d; REMEMBER_ME=true; SCREEN_NAME=45344a4a744d4f30464e6d543856794e4b4e6d6672513d3d',
          'Connection': 'keep-alive'
        },
        method: 'POST'
      }, (err, res, body) => {
        if(res.headers['content-encoding'] == 'gzip') {
          zlib.gunzip(res.body, (err, dezip) => {
            if(err) {

              console.log(err);
            }else {
              var branch = JSON.parse(dezip.toString())

              layouts[i].children = branch;
              console.log(branch)


              if(branch.layouts.length != 0) {
                fillBranch(branch.layouts);
              }
            }




            callback();
          });
        }
      });
    }
  });
/*

  */
}


var parent = 3;
var selPlid = 0;
request('https://www.marist.edu/c/layouts_admin/get_layouts?cmd=get&doAsGroupId=20182&end=20&groupId=20182&incomplete=1&limit=20&p_auth=qVxIXONA&p_l_id=20176&p_p_id=88&parentLayoutId=' + parent + '&privateLayout=0&selPlid=' + selPlid + '&start=0&treeId=layoutsTree', {
  encoding: null,
  credentials: 'same-origin',
  headers: {
    'Host': 'www.marist.edu',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://www.marist.edu/group/control_panel?refererPlid=20185&doAsGroupId=20182&controlPanelCategory=current_site.pages&p_p_id=156&_156_selPlid=137837',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Content-Length': '224',
    'Cookie': '__utma=220728263.1974296480.1521576471.1526050319.1528481507.5; __utmz=220728263.1521576471.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; _ga=GA1.2.1974296480.1521576471; JSESSIONID=A0F3F5D9A128270594492EBC279B4538; _gid=GA1.2.1139722017.1531746938; LFR_SESSION_STATE_20159=1531752816621; COMPANY_ID=20155; ID=6168316a6c526452776a4a515133627450776e5930773d3d; USER_UUID=374652383144446d48454f78374c4f4a49384335425073376b58743249394d456e613965485362325475303d; LFR_SESSION_STATE_175775=expired; LOGIN=616b7572617461; PASSWORD=594c424174496b5668376f5632393558486f324761413d3d; REMEMBER_ME=true; SCREEN_NAME=45344a4a744d4f30464e6d543856794e4b4e6d6672513d3d',
    'Connection': 'keep-alive'
  },
  method: 'POST'
}, (err, res, body) => {
  if(res.headers['content-encoding'] == 'gzip') {
  zlib.gunzip(res.body, (err, dezip) => {
    if(err) console.log(err);
    //console.log(dezip.toString());
    test += dezip.toString();
  });
  }
});











app.get('/', (req, res) => {
  res.json(tree);
  //res.json(tree.split(''))
  res.end();
});
app.get('/full', (req, res) => {
  res.send(full)
});
app.get('/test', (req, res) => {
  res.json(JSON.parse(test));
  res.end();
})

app.listen('3000', () => {
  console.log("Start");
});
