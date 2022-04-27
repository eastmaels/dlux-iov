import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js";
import Navue from "/js/navue.js";
import FootVue from "/js/footvue.js";
import Cycler from "/js/cycler.js";

let url = location.href.replace(/\/$/, "");
let lapi = "";
if (location.search) {
    const string = location.search.replace("?", "");
    let params = string.split("&");
    for (let i = 0; i < params.length; i++) {
        let param = params[i].split("=");
        if (param[0] == "api") {
            lapi = param[1];
        }
    }
    //window.history.replaceState(null, null, "dex?api=" + lapi);
}
if (location.hash && !lapi) {
    const hash = url.split("#");
    if (hash[1].includes("dlux")) {
        lapi = "https://token.dlux.io";
    } else if (hash[1].includes("larynx")) {
        lapi = "https://spkinstant.hivehoneycomb.com";
    } else if (hash[1].includes("duat")) {
        lapi = "https://duat.hivehoneycomb.com";
    }
}
if (!lapi) {
    lapi = localStorage.getItem("lapi") || "https://token.dlux.io";
}
console.log(lapi);
if (
    lapi == "https://token.dlux.io" ||
    lapi == "https://spkinstant.hivehoneycomb.com" ||
    lapi == "https://duat.hivehoneycomb.com"
) {
    console.log("using defaults");
    //window.history.replaceState(null, null, "dex");
}
let user = localStorage.getItem("user") || "GUEST";
let hapi = localStorage.getItem("hapi") || "https://api.hive.blog";
console.log({
    lapi,
});

Vue.directive("scroll", {
    inserted: function (el, binding) {
        const onScrollCallback = binding.value;
        window.addEventListener("scroll", () => onScrollCallback());
    },
});

// createApp({ // vue 3
var app = new Vue({
    // vue 2
    el: "#app", // vue 2
    data() {
        return {
          toSign: {},
          account: user,
          pfp: {
            set: "",
            uid: "",
          },
          hasDrop: false,
          dropnai: "",
          balance: "0.000",
          bartoken: "",
          barhive: "",
          barhbd: "",
          bargov: "",
          barpow: "",
          toSign: {},
          buyFormValid: false,
          sellFormValid: false,
          govFormValid: false,
          powFormValid: false,
          sendFormValid: false,
          hiveFormValid: false,
          hbdFormValid: false,
          lapi: lapi,
          hapi: hapi,
          accountapi: {},
          hiveprice: {
            hive: {
              usd: 1,
            },
          },
          hbdprice: {
            hive_dollar: {
              usd: 1,
            },
          },
          nodes: {},
          runners: [],
          runnersSearch: [],
          marketnodes: {},
          dexapi: {
            markets: {
              hive: {
                tick: 0.001,
              },
              hbd: {
                tick: 0.001,
              },
            },
          },
          prefix: "",
          multisig: "",
          jsontoken: "",
          node: "",
          showTokens: {},
          behind: "",
          stats: {},
          behindTitle: "",
          TOKEN: "LARYNX",
          sendTo: "",
          sendAmount: 0,
          sendMemo: "",
          sendAllowed: false,
          sendHiveTo: "",
          sendHiveAllowed: false,
          sendHiveAmount: 0,
          sendHiveMemo: "",
          sendHBDTo: "",
          sendHBDAllowed: false,
          sendHBDAmount: 0,
          sendHBDMemo: "",
          recenthive: {},
          recenthbd: {},
          openorders: [],
          toasts: [],
          features: {
            claim_id: "claim",
            claim_S: "Airdrop",
            claim_B: true,
            claim_json: "drop",
            rewards_id: "shares_claim",
            rewards_S: "Rewards",
            rewards_B: true,
            rewards_json: "claim",
            rewardSel: false,
            reward2Gov: false,
            send_id: "send",
            send_S: "Send",
            send_B: true,
            send_json: "send",
            powup_id: "power_up",
            powup_B: false,
            pow_val: "",
            powdn_id: "power_down",
            powdn_B: false,
            powsel_up: true,
            govup_id: "gov_up",
            govup_B: true,
            gov_val: "",
            govsel_up: true,
            govdn_id: "gov_down",
            govdn_B: true,
            node: {
              id: "node_add",
              opts: [
                {
                  S: "Domain",
                  type: "text",
                  info: "https://no-trailing-slash.com",
                  json: "domain",
                  val: "",
                },
                {
                  S: "DEX Fee Vote",
                  type: "number",
                  info: "500 = .5%",
                  max: 1000,
                  min: 0,
                  json: "bidRate",
                  val: "",
                },
                {
                  S: "DEX Max Vote",
                  type: "number",
                  info: "10000 = 100%",
                  max: 10000,
                  min: 0,
                  json: "dm",
                  val: "",
                },
                {
                  S: "DEX Slope Vote",
                  type: "number",
                  info: "10000 = 100%",
                  max: 10000,
                  min: 0,
                  json: "ds",
                  val: "",
                },
                {
                  S: "DAO Claim Vote",
                  type: "number",
                  info: "1500 = 15%",
                  max: 10000,
                  min: 0,
                  json: "dv",
                  val: "",
                },
              ],
            },
          },
          accountinfo: {},
          filterusers: {
            checked: true,
            value: "",
          },
          filteraccount: {
            checked: false,
            value: "",
            usera: false,
            userd: false,
            gova: false,
            govd: true,
            apia: false,
            apid: false,
          },
          lockgov: {
            checked: true,
          },
          unlockgov: {
            checked: false,
          },
          buyhive: {
            checked: true,
          },
          buyhbd: {
            checked: false,
          },
          buylimit: {
            checked: true,
          },
          buymarket: {
            checked: false,
          },
          selllimit: {
            checked: true,
          },
          sellmarket: {
            checked: false,
          },
          pwrup: {
            checked: true,
          },
          pwrdown: {
            checked: false,
          },
          govlock: {
            checked: true,
          },
          govunlock: {
            checked: false,
          },
          posturls: {},
          postSelect: {
            sort: "time",
            searchTerm: "",
            entry: "new",
            sortDir: "desc",
            amount: 50,
            types: {
              VR: {
                checked: true,
                icon: "fa-solid fa-vr-cardboard me-2",
                hint: "",
              },
              AR: {
                checked: true,
                icon: "fa-solid fa-glasses me-2",
                hint: "",
              },
              XR: {
                checked: true,
                icon: "fa-brands fa-unity me-2",
                hint: "",
              },
              APP: {
                checked: true,
                icon: "fa-solid fa-mobile-screen-button me-2",
                hint: "",
              },
              ["360"]: {
                checked: true,
                icon: "fa-solid fa-globe me-2",
                hint: "",
              },
              ["3D"]: {
                checked: true,
                icon: "fa-solid fa-shapes me-2",
                hint: "",
              },
              Audio: {
                checked: true,
                icon: "fa-solid fa-music me-2",
                hint: "",
              },
              Video: {
                checked: true,
                icon: "fa-solid fa-film me-2",
                hint: "",
              },
              Blog: {
                checked: false,
                icon: "fa-solid fa-book me-2",
                hint: "",
              },
            },
          },
          displayPosts: [],
          displayPost: {
            index: 0,
            item: {
              author: "",
              permlink: "",
              ago: "",
              pic: "",
              preview: "",
              appurl: "",
              id: "",
              slider: 100,
              title: "",
              url: "",
              children: [],
              total_payout_value: 0,
              active_votes: [],
              upVotes: 0,
              downVotes: 0,
              body: "",
              json_metadata: {},
              created: "",
            },
            items: [],
          },
          authors: {},
        };
    },
    components: {
        "nav-vue": Navue,
        "foot-vue": FootVue,
        "cycle-text": Cycler,
    },
    methods: {
        precision(num, precision) {
            return parseFloat(num / Math.pow(10, precision)).toFixed(precision);
        },
        handleScroll: function () {
            if (
                document.documentElement.clientHeight + window.scrollY >
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight * 2
            ) {
                this.postSelect.amount += 30;
                this.selectPosts();
                console.log('scrolling')
            }
        },
        modalNext(modal) {
            if (
              this.postSelect.VR.checked ||
              this.postSelect.AR.checked ||
              this.postSelect.XR.checked ||
              this.postSelect.Blog.checked ||
              this.postSelect.sort == "payout" ||
              this.postSelect.searchTerm
            ) {
              this[modal].index =
                (this[modal].index + 1) % this[modal].items.length;
              this[modal].item = this[modal].items[this[modal].index];
            } else if (this[modal].index < this[modal].items.length - 1) {
              this[modal].index++;
              this[modal].item = this[modal].items[this[modal].index];
            } else if (this[modal].index < this.allPosts.length - 1) {
              this.postSelect.amount += 6;
              this.selectPosts("", [modal, this[modal].index + 1]);
            } else {
              this[modal].index = 0;
              this[modal].item = this[modal].items[this[modal].index];
            }
        },
        modalPrev(modal) {
            if (this[modal].index) this[modal].index--;
            else this[modal].index = this[modal].items.length - 1;
            this[modal].item = this[modal].items[this[modal].index];
        },
        modalIndex(modal, index) {
            var i = 0;
            for (i; i < this.selectedNFTs.length; i++) {
                if (this.selectedNFTs[i].uid == index) break;
            }
            this[modal].index = i;
            this[modal].item = this[modal].items[this[modal].index];
            if (this[modal].item.owner == "ls") this.saleData(modal);
            else if (this[modal].item.owner == "ah") this.auctionData(modal);
        },
        removeOp(txid) {
            if (this.toSign.txid == txid) {
                this.toSign = {};
            }
        },
        run(op) {
            if (typeof this[op] == "function" && this.account != "GUEST") {
                this[op](this.account);
            }
        },
        checkAccount(name, key) {
            fetch("https://anyx.io", {
                body: `{\"jsonrpc\":\"2.0\", \"method\":\"condenser_api.get_accounts\", \"params\":[[\"${this[name]}\"]], \"id\":1}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                method: "POST",
            })
                .then((r) => {
                    return r.json();
                })
                .then((re) => {
                    if (re.result.length) this[key] = true;
                    else this[key] = false;
                });
        },
        tokenSend() {
            if (!this.sendFormValid) return;
            if (this.sendAllowed) {
                this.toSign = {
                    type: "cja",
                    cj: {
                        to: this.sendTo,
                        amount: parseInt(this.sendAmount * 1000),
                        memo: this.sendMemo,
                    },
                    id: `${this.prefix}send`,
                    msg: `Trying to send ${this.TOKEN}...`,
                    ops: ["getTokenUser"],
                    txid: "send",
                };
            } else alert("Username not found");
        },
        sendhive() {
            if (!this.hiveFormValid) return;
            if (this.sendHiveAllowed)
                this.toSign = {
                    type: "xfr",
                    cj: {
                        to: this.sendHiveTo,
                        hive: this.sendHiveAmount * 1000,
                        memo: this.sendHiveMemo,
                    },
                    txid: "sendhive",
                    msg: ``,
                    ops: ["getHiveUser"],
                };
            else alert("Account Not Found");
        },
        sendhbd() {
            if (!this.hbdFormValid) return;
            if (this.sendHBDAllowed)
                this.toSign = {
                    type: "xfr",
                    cj: {
                        to: this.sendHBDTo,
                        hbd: this.sendHBDAmount * 1000,
                        memo: this.sendHBDMemo,
                    },
                    txid: "sendhbd",
                    msg: ``,
                    ops: ["getHiveUser"],
                };
            else alert("Account Not Found");
        },
        localStoreSet(k, v) {
            localStorage.setItem(k, v);
        },
        toFixed(value, decimals) {
            return Number(value).toFixed(decimals);
        },
        parseFloat(value) {
            return parseFloat(value);
        },
        toUpperCase(value) {
            return value.toUpperCase();
        },
        formatNumber(t, n, r, e) {
            if (typeof t != "number") t = parseFloat(t);
            if (isNaN(t)) return "Invalid Number";
            if (!isFinite(t)) return (t < 0 ? "-" : "") + "infinite";
            (r = r || "."), (e = e || "");
            var u = t < 0;
            t = Math.abs(t);
            var a = (null != n && 0 <= n ? t.toFixed(n) : t.toString()).split("."),
                i = a[0],
                o = 1 < a.length ? r + a[1] : "";
            if (e)
                for (var c = /(\d+)(\d{3})/; c.test(i);)
                    i = i.replace(c, "$1" + e + "$2");
            return (u ? "-" : "") + i + o;
        },
        setApi(url) {
            // remove trailing slash
            if (url.substr(-1) == "/") {
                url = url.substr(0, url.length - 1);
            }
            let api =
                url ||
                prompt("Please enter your API", "https://spkinstant.hivehoneycomb.com");
            if (url.indexOf("https://") == -1) {
                alert("https is required");
                return;
            }
            if (api != null) {
                if (location.hash && api) {
                    location.hash = "";
                }
                localStorage.setItem("lapi", api);
                location.search = "?api=" + api;
            }
        },
        toLowerCase(v) {
            return typeof v == "string" ? v.toLowerCase() : v;
        },
        suggestValue(key, value) {
            if (key.split(".").length > 1) {
                let keys = key.split(".");
                let obj = this[keys[0]];
                for (let i = 1; i < keys.length; i++) {
                    if (i == keys.length - 1) {
                        if (!obj[keys[i]]) obj[keys[i]] = value;
                    } else {
                        obj = obj[keys[i]];
                    }
                }
            } else {
                if (!this[key]) this[key] = value;
            }
        },
        setMem(key, value, reload) {
            if (value.indexOf("https://") == -1) {
                alert("https:// is required for security reasons");
                return;
            } else if (value[value.length - 1] == "/") {
                value = value.substring(0, value.length - 1);
            }
            localStorage.setItem(key, value);
            if (reload) {
                location.reload();
            }
        },
        sort(item, key, method) {
            switch (method) {
                case "asc":
                    this[item].sort((a, b) => {
                        return a[key] < b[key] ? -1 : 1;
                    });
                    break;
                case "desc":
                default:
                    this[item].sort((a, b) => {
                        return a[key] > b[key] ? -1 : 1;
                    });
            }
        },
        validateForm(formKey, validKey) {
            var Container = document.getElementById(formKey);
            if (Container.querySelector("input:invalid")) this[validKey] = false;
            else this[validKey] = true;
        },
        getPosts(key = 'new') {
            fetch(`https://dluxdata.herokuapp.com/${key}`)
                .then(r => r.json())
                .then(res => {
                    var authors = []
                    for (var i = 0; i < res.result.length; i++) {
                        if (!this.posturls[res.result[i].url]) {
                            this.posturls[res.result[i].url] = res.result[i]
                        }
                    }
                    for (var post in this.posturls) {
                        this.getContent(
                            this.posturls[post].author,
                            this.posturls[post].permlink
                        );
                        authors.push(this.posturls[post].author)
                    }
                    authors = [...new Set(authors)]
                    this.getHiveAuthors(authors)
                })
        },
        selectPosts(reset, modal){
            if (reset) {
                this.displayPosts = []
            }
            for (var post in this.posturls){
                if (this.posturls[post].type)
                  this.displayPosts.push(this.posturls[post]);
            }
            if (this.postSelect.searchTerm)this.displayPosts = this.displayPosts.filter(post => 
                post.title.toLowerCase().indexOf(this.postSelect.searchTerm.toLowerCase()) > -1  || 
                post.author.toLowerCase().indexOf(this.postSelect.searchTerm.toLowerCase()) > -1 || 
                post.json_metadata.tags.indexOf(this.postSelect.searchTerm.toLowerCase()) > -1)
            for(var i = 0; i < this.displayPosts.length; i++){
                if(!this.postSelect.types[this.displayPosts[i].type].checked){
                    this.displayPosts.splice(i, 1)
                    i--
                }
            }
            if (this.postSelect.entry == "new")
                this.sort("displayPosts", "created", "desc");
            if (modal) {
                this[modal[0]].items = this.displayPosts
                this[modal[0]].item = this[modal[0]].items[modal[1]];
                this[modal[0]].index = modal[1]
            }
        },
        getContent(a, p) {
            if(a && p){
            fetch(this.hapi, {
                body: `{"jsonrpc":"2.0", "method":"condenser_api.get_content", "params":["${a}", "${p}"], "id":1}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
                .then(r => r.json())
                .then(res => {
                    if (res.result){
                      this.posturls[res.result.url] = {
                        ...this.posturls[res.result.url],
                        ...res.result,
                      };
                    try{
                        this.posturls[res.result.url].json_metadata =
                          JSON.parse(
                            this.posturls[res.result.url].json_metadata
                          );
                    } catch (e){console.log(res.result.url, "no JSON?");}
                    var type = 'Blog'
                    if (
                      "QmNby3SMAAa9hBVHvdkKvvTqs7ssK4nYa2jBdZkxqmRc16" ==
                      this.posturls[res.result.url].json_metadata.vrHash
                    )
                      type = "360";
                    else if (this.posturls[res.result.url].json_metadata.vrHash)
                      type = "VR";
                    else if (this.posturls[res.result.url].json_metadata.arHash)
                      type = "AR";
                    else if (this.posturls[res.result.url].json_metadata.appHash)
                      type = "APP";
                    else if (this.posturls[res.result.url].json_metadata.audHash)
                      type = "Audio";
                    else if (this.posturls[res.result.url].json_metadata.vidHash)
                      type = "Video";
                    this.posturls[res.result.url].type = type;

                    this.selectPosts();
                    }
                })
            } else {
                console.log("no author or permlink", a, p)
            }
        },
        getQuotes() {
            fetch(
                "https://api.coingecko.com/api/v3/simple/price?ids=hive&amp;vs_currencies=usd"
            )
                .then((response) => response.json())
                .then((data) => {
                    this.hiveprice = data;
                });
            fetch(
                "https://api.coingecko.com/api/v3/simple/price?ids=hive_dollar&amp;vs_currencies=usd"
            )
                .then((response) => response.json())
                .then((data) => {
                    this.hbdprice = data;
                });
        },
        getNodes() {
            fetch(this.lapi + "/runners")
                .then((response) => response.json())
                .then((data) => {
                    this.runners = data.result.sort((a, b) => {
                        return b.g - a.g;
                    });
                });
            fetch(this.lapi + "/markets")
                .then((response) => response.json())
                .then((data) => {
                    this.nodes = data.markets.node;
                    this.stats = data.stats;
                });
        },
        getProtocol() {
            fetch(this.lapi + "/api/protocol")
                .then((response) => response.json())
                .then((data) => {
                    this.prefix = data.prefix;
                    this.multisig = data.multisig;
                    this.jsontoken = data.jsontoken;
                    this.TOKEN = data.jsontoken.toUpperCase();
                    location.hash = data.jsontoken;
                    this.node = data.node;
                    this.features = data.features ? data.features : this.features;
                    this.behind = data.behind;
                    this.behindTitle = data.behind + " Blocks Behind Hive";
                });
        },
        removeUser() {
            this.balance = 0;
            this.bartoken = "";
            this.barpow = "";
            this.bargov = "";
            this.accountapi = "";
            this.hasDrop = false;
            this.openorders = [];
            this.accountinfo = {};
            this.barhive = "";
            this.barhbd = "";
        },
        getPFP() {
            if (this.account) {
                fetch(this.lapi + "/api/pfp/" + this.account)
                    .then((r) => r.json())
                    .then((json) => {
                        if (json.result == "No Profile Picture Set or Owned") return;
                        this.pfp.set = json.result[0].pfp.split(":")[0];
                        this.pfp.uid = json.result[0].pfp.split(":")[1];
                    });
            }
        },
        pm(a, b) {
            return a.some((item) => b.includes(item));
        },
        naiString(nai) {
            return `${parseFloat(nai.amount / Math.pow(10, nai.precision)).toFixed(
                nai.precision
            )} ${nai.token}`;
        },
        getTokenUser(user) {
            if (user)
                fetch(this.lapi + "/@" + user)
                    .then((response) => response.json())
                    .then((data) => {
                        this.balance = (data.balance / 1000).toFixed(3);
                        this.bartoken = this.balance;
                        this.barpow = (
                            (data.poweredUp + data.granted - data.granting) /
                            1000
                        ).toFixed(3);
                        this.bargov = (data.gov / 1000).toFixed(3);
                        this.accountapi = data;
                        if (
                            new Date().getMonth() + 1 !=
                            parseInt(data.drop?.last_claim, 16) &&
                            data.drop?.availible.amount > 0
                        ) {
                            this.hasDrop = true;
                            this.dropnai = `${parseFloat(
                                data.drop.availible.amount /
                                Math.pow(10, data.drop.availible.precision)
                            ).toFixed(data.drop.availible.precision)} ${data.drop.availible.token
                                }`;
                        }
                    });
        },
        getHiveUser(user) {
            if (user)
                fetch(hapi, {
                    body: `{"jsonrpc":"2.0", "method":"condenser_api.get_accounts", "params":[["${user}"]], "id":1}`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    method: "POST",
                })
                    .then((response) => response.json())
                    .then((data) => {
                        this.accountinfo = data.result[0];
                        this.barhive = this.accountinfo.balance;
                        this.barhbd = this.accountinfo.hbd_balance;
                    });
        },
        getHiveAuthors(users) {
            var q = ''
            for (var i = 0; i < users.length; i++) {
                if (!this.authors[users[i]]) q += `"${users[i]}",`
            }
            if (q.length > 0) {
                q = q.substring(0, q.length - 1)
                fetch(hapi, {
                    body: `{"jsonrpc":"2.0", "method":"condenser_api.get_accounts", "params":[[${q}]], "id":1}`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    method: "POST",
                })
                    .then((response) => response.json())
                    .then((data) => {
                        for (var i = 0; i < data.result.length; i++) {
                            this.authors[data.result[i].name] = data.result[i]
                        }
                    });
            }
        },
    },
    mounted() {
        // var setName = location.pathname.split("set/")[1];
        // if (setName) this.getNFTset(setName);
        // else this.getNFTsets();
        // this.getUserNFTs();
        //this.getQuotes();
        //this.getNodes();
        this.getPosts()
        this.getProtocol();
        //if (user != "GUEST") this.getTokenUser(user);
        //if (user != "GUEST") this.getHiveUser(user);
    },
    computed: {
        location: {
            get() {
                return location;
            },
        }
    },
});
