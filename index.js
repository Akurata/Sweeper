const express = require('express');
var app = express();

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var request = require('request');
var async = require('async');
var zlib = require('zlib');

var ProgressBar = require('cli-progress');
const bar = new ProgressBar.Bar({}, ProgressBar.Presets.shades_classic);

var response;
var count = [];

var tree = "";
var list = [];


var jsessionid = 'B850F21BF2ADCBB0F212050111B66A1E';
var p_pauth = 'C3bDBwuU';



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
    'Cookie': '__utma=220728263.1974296480.1521576471.1526050319.1528481507.5; __utmz=220728263.1521576471.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; _ga=GA1.2.1974296480.1521576471; JSESSIONID=' + jsessionid + '; _gid=GA1.2.1139722017.1531746938; LFR_SESSION_STATE_20159=1531752816621; COMPANY_ID=20155; ID=6168316a6c526452776a4a515133627450776e5930773d3d; USER_UUID=374652383144446d48454f78374c4f4a49384335425073376b58743249394d456e613965485362325475303d; LFR_SESSION_STATE_175775=expired; LOGIN=616b7572617461; PASSWORD=594c424174496b5668376f5632393558486f324761413d3d; REMEMBER_ME=true; SCREEN_NAME=45344a4a744d4f30464e6d543856794e4b4e6d6672513d3d',
    'REMEMBER_ME': 'true'
    },
  method: 'POST'
}, (err, res, body) => {
  if(res.headers['content-encoding'] == 'gzip') {
    zlib.gunzip(res.body, (err, dezip) => {
      if (err) console.log(err);

      response = dezip.toString();
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

      tree = JSON.parse(tree);
      addChildren(tree.layouts);
    });
  }
});


function addChildren(array) {
  console.log('Add Children...')

  function fillBranch(layouts) {
    async.forEachOf(layouts, (result, i, callback) => {
    //layouts.forEach((item, i) => {
      if(layouts[i].hasChildren) {
        request('https://www.marist.edu/c/layouts_admin/get_layouts?cmd=get&doAsGroupId=20182&end=20&groupId=20182&incomplete=1&limit=20&p_auth=' + p_pauth + '&p_l_id=20176&p_p_id=88&parentLayoutId=' + layouts[i].layoutId + '&privateLayout=0&start=0&treeId=layoutsTree', {
          encoding: null,
          credentials: 'same-origin',
          headers: {
            'Host': 'www.marist.edu',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
            'Accept': '*\/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.marist.edu/group/control_panel?refererPlid=20185&doAsGroupId=20182&controlPanelCategory=current_site.pages&p_p_id=156&_156_selPlid=138920',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length': '225',
            'Cookie':' __utma=220728263.1974296480.1521576471.1526050319.1528481507.5; __utmz=220728263.1521576471.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; _ga=GA1.2.1974296480.1521576471; JSESSIONID=' + jsessionid + '; _gid=GA1.2.1139722017.1531746938; LFR_SESSION_STATE_20159=1531752816621; COMPANY_ID=20155; ID=6168316a6c526452776a4a515133627450776e5930773d3d; USER_UUID=374652383144446d48454f78374c4f4a49384335425073376b58743249394d456e613965485362325475303d; LFR_SESSION_STATE_175775=expired; LOGIN=616b7572617461; PASSWORD=594c424174496b5668376f5632393558486f324761413d3d; REMEMBER_ME=true; SCREEN_NAME=45344a4a744d4f30464e6d543856794e4b4e6d6672513d3d',
            'Connection': 'keep-alive'
          },
          method: 'POST'
        }, (err, res, body) => {
          if(res.headers['content-encoding'] == 'gzip') {
            zlib.gunzip(res.body, (err, dezip) => {
              if(err) throw err;

                var branch = JSON.parse(dezip.toString());
                layouts[i].children = branch;

                if(list.indexOf(layouts[i].friendlyURL) == -1) { //Add to list
                  list.push(layouts[i].friendlyURL);
                }


                if(branch.layouts.length != 0) {
                  fillBranch(branch.layouts);
                }else {
                  callback();
                }

            });
          }
        });

      }else {
        if(list.indexOf(layouts[i].friendlyURL) == -1) { //Add to list
          list.push(layouts[i].friendlyURL);
        }
        callback();
      }
    });
  }
  fillBranch(array);
  console.log('Add Children - Done')

  return new Promise((resolve, reject) => {
    resolve();
  });
}


/*
function makeList(a) {
  console.log('Write List...');

  function writeList(layouts) {
    async.eachOfSeries(layouts, (result, i, callback) => {
      if(list.indexOf(layouts[i].friendlyURL) == -1) {
        list.push(layouts[i].friendlyURL);
      }
      if(layouts[i].hasChildren) {
        writeList(layouts[i].children.layouts);
      }
      callback();

    }, (err) => {
      if(err) throw err;
    });
  }
  writeList(a);

  console.log('Write List - Done')

  return new Promise((resolve, reject) => {
    resolve();
  })

}
*/




//Looking for http://www.marist.edu/images/pdficon.gif
var found = [];
function sweep(search) {
  console.log("\nSearch Called...");
  console.log(search);

  var progress = 1;
  bar.start(list.length, progress);


  async.forEachOf(list, (results, i, callback) => {
  //list.forEach((item, i) => {
    var result = [];
    request('https://www.marist.edu' + list[i], {
      credentials: 'same-origin',
      headers: {
        'Host': 'www.marist.edu',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Upgrade-Insecure-Requests': 1,
        'Cookie': 'JSESSIONID=3AD0AFA97426F2F4029F18AB61C3881B; COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; _ga=GA1.2.1679792909.1531840888; _gid=GA1.2.729270746.1531840888; _gat_gtag_UA_320870_1=1; LFR_SESSION_STATE_20159=1531840887798',
        'Connection': 'keep-alive'
      },
      method: 'GET'
    }, (err, res, body) => {
      console.log(i + ": " + res.statusCode)
      if(err) throw err;

    }).on('response', (res) => {
      console.log('START: ' + i)

      //res.pipe(zlib.createGunzip()).pipe(result)

    }).on('data', (data) => {
      console.log("Data for " + i)
      //result += data;
    }).on('end', () => {
      console.log('END: ' + i)
      /*
      zlib.gunzip(result, (err, dezip) => {
        if(err) {
          console.log("Error at " + i)
          throw err;
        }else {
          console.log("Done " + i)
          if(dezip.toString().match(new RegExp(search, "gi")) !== null) {
            found.push(list[i]);
          }
        }
      })*/

      console.log(result)
      bar.update(progress++);
      callback();
    })
/*
    .on('response', (res) => {
      console.log("START: " + i + " - " + res.statusCode)
      if(res.statusCode == 200) {
        if(res.headers['content-encoding'] == 'gzip') {
          res.pipe(zlib.createGunzip())
        }
      }
      */
      //if(res.statusCode === 200) {
      //  result.push(res.body);
      //  console.log("\n"+i)
      //}
    .on('error', (err) => {
      throw err;
    })


/*
    .on('data', (data) => {
      //console.log(res.statusCode)
      result.push(data);
      console.log("\n"+i)
    }).on('end', (data) => {
      //result.push(data);
      console.log("END: " + i)
      zlib.gunzip(Buffer.concat(result), (err, dezip) => {
        if(err) {
          throw err;
        }
        if(dezip.toString().match(new RegExp(search, "gi")) !== null) {
          found.push(list[i]);
        }

        bar.update(progress++);
        //callback();
      });
    })

*/

  }, (err) => {
    if(err) throw err;
    console.log("\nSearch Done.")
    //console.log(found)
  });

}








app.get('/', (req, res) => {
  res.json(tree);
  //res.json(tree.split(''))
  res.end();
});
app.get('/list', (req, res) => {
  res.json(list);
  res.end();
});
app.get('/updateTree', (req, res) => {
  fs.writeFileSync('./tree.json', JSON.stringify(tree, 'utf8', 4), () => {
    console.log("Done!");
  });
});
app.get('/updateList', (req, res) => {
  fs.writeFile('./pageList.txt', JSON.stringify(list, 'utf8', 1), () => {
    console.log("Done!");
  });
  res.send("Done!");
  res.end();
});



app.route('/login')
  .get((req, res) => {
    res.sendFile(path.resolve('./loginPage.html'));
  })
  .post((req, res) => {
    //TODO: Push post request against liferay server to duplicate login information
    //p_auth
    //JSESSIONID
  });

app.get('/search', (req, res) => {
  sweep('/images/pdficon.gif');
  res.json(found);
  res.end();
});



app.listen('3000', () => {
  console.log("Start");
});
