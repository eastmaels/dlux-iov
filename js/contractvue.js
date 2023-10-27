import Pop from "/js/pop.js";
import ExtensionVue from "/js/extensionvue.js";
import FilesVue from "/js/filesvue.js";

/*  */

export default {
    components: {
        "pop-vue": Pop,
        "extension-vue": ExtensionVue,
        "files-vue": FilesVue
    },
    template: `
    <table class="table table-dark table-striped table-hover text-center align-middle mb-0">
        <thead>
            <tr>

                <th scope="col"><i
                        class="fa-solid fa-database fa-fw me-2"></i>Storage</th>
                <th scope="col"><i
                        class="fa-solid fa-clock fa-fw me-2"></i>Expiration</th>
                <th scope="col"><i
                        class="fa-solid fa-hand-holding-dollar fa-fw me-2"></i>Status
                </th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>

                <tr v-for="contract in contracts">
                    <td colspan="4" class="p-0">
                        <div class="table-responsive">
                            <table class="table text-white align-middle mb-0">
                                <tbody>
                                    <tr>
                                        <th class="border-0">
                                            {{contract.a/1000000}}
                                            MB</th>
                                        <td class="border-0">
                                            <span v-if="contract.c == 1">
                                            {{exp_to_time(contract.e)}}
                                            </span>
                                        </td>
                                        <td class="border-0" scope="row">
                                            <span v-if="contract.c == 1 && contract.s">
                                            @{{slotDecode(contract.s, 0)}}
                                            ({{slotDecode(contract.s, 1)}}%)
                                            </span>
                                        </td>
                                        <td class="border-0" scope="row">
                                        <span v-if="contract.c == 1 && !contract.s">
                                            Waiting for upload
                                            </span>
                                            <span v-if="contract.c == 2">
                                            Waiting for post
                                            </span>
                                            <span v-if="contract.c == 3 && !contract.s">
                                            1/3 Nodes hosting
                                            </span>
                                        </td>
                                        <td class="border-0 text-end">
                                            <span v-if="contract.c == 1">
                                            <button type="button"
                                                class="btn btn-sm btn-outline-success"
                                                v-bind:class="{'invisible': contract.id}"
                                                @click="selectContract(contract.i, contract.b)"><i
                                                    class="fa-solid fa-file-medical fa-fw"></i></button>

                                            <button type="button"
                                                class="btn btn-sm btn-success"
                                                v-bind:class="{'d-none': !contract.id || contract.id != contract.i}"
                                                @click="contract.id = ''; contract.api = ''"><i
                                                    class="fa-solid fa-file-medical fa-fw"></i></button>
                                            </span>
                                            <a class="collapsed no-decoration"
                                                data-bs-toggle="collapse"
                                                :href="'#' + replace(contract.i) + 'extension'">
                                                <span
                                                    class="if-collapsed"><button
                                                        class="btn btn-sm btn-outline-light"><i
                                                            class="fa-solid fa-clock-rotate-left fa-fw"></i></button></span>
                                                <span
                                                    class="if-not-collapsed"><button
                                                        class="btn btn-sm btn-light"><i
                                                            class="fa-solid fa-clock-rotate-left fa-fw"></i></button></span>
                                            </a>
                                            <a class="ms-1 collapsed no-decoration" data-bs-toggle="collapse"
                                            :href="'#' + replace(contract.i) + 'files'">
                                            <span class="if-collapsed">
                                                <button class="btn btn-sm btn-outline-info">
                                                    <i class="fa-solid fa-file fa-fw"></i>
                                                </button>
                                            </span>
                                            <span class="if-not-collapsed">
                                                <button class="btn btn-sm btn-info">
                                                    <i class="fa-solid fa-file fa-fw"></i>
                                                </button>
                                            </span>
                                            </a>
                                            
                                            <a class="collapsed ms-1"
                                                data-bs-toggle="collapse"
                                                :href="'#' + replace(contract.i)">
                                                <span
                                                    class="if-collapsed"><button
                                                        class="btn btn-sm btn-outline-primary"><i
                                                            class="fa-solid fa-magnifying-glass fa-fw"></i></button></span>
                                                <span
                                                    class="if-not-collapsed"><button
                                                        class="btn btn-sm btn-primary"><i
                                                            class="fa-solid fa-magnifying-glass fa-fw"></i></button></span>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="collapse border-0"
                                            colspan="4" :id="replace(contract.i)">
                                            <ul class="text-start">
                                                <li>Contract ID: {{contract.i}}
                                                </li>
                                                <li>Size
                                                    Allowed:
                                                    {{contract.a}} bytes</li>
                                                <li v-if="contract.c == 2">Size:
                                                    {{contract.u}} bytes
                                                </li>
                                                <li>File Owner: @{{contract.t}}
                                                </li>
                                                <li>Service Provider:
                                                    @{{contract.b}}
                                                </li>
                                                <li>Sponsor: @{{contract.f}}</li>
                                                <li>Expiration:
                                                    {{exp_to_time(contract.e)}}
                                                </li>
                                                <li>Price: {{contract.r}} Broca
                                                </li>
                                                <li>Redundancy: {{contract.p}}
                                                </li>
                                                <li v-if="contract.s">Terms:
                                                    {{slotDecode(contract.s,
                                                    1)}}%
                                                    Beneficiary to
                                                    @{{slotDecode(contract.s,
                                                    0)}}</li>
                                                <li>Status: {{contract.c == 1 ?
                                                    'Waiting For Upload' :
                                                    'Uploaded'}}
                                                </li>
                                                <li v-if="contract.df">Files:<p
                                                        v-for="file in contract.df">
                                                        {{file}}
                                                    </p>
                                                </li>
                                                <li v-if="contract.n">Stored by:
                                                    <p v-for="acc in contract.n">
                                                        @{{acc}}
                                                    </p>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>                       
        </tbody>
    </table>`,
    props: {
        account: {
            default: ''
        },
        sapi: {
            default: 'https://spktest.dlux.io'
        },
    },
    data() {
        return {
            tick: "1",
            larynxbehind: 999999,
            lbalance: 0,
            lbargov: 0,
            spkval: 0,
            sstats: {},
            contracts: [],
            contractIDs: {},
            saccountapi: {
                spk: 0,
                balance: 0,
                gov: 0,
                poweredUp: 0,
                claim: 0,
                granted: {
                    t: 0
                },
                granting: {
                    t: 0
                }
            },
            tokenGov: {
                title: "SPK VOTE",
                options: [
                  {
                    id: "spk_cycle_length",
                    range_low: 28800,
                    range_high: 2592000,
                    info: "Time in blocks to complete a power down cycle. 4 cycles to completely divest. 28800 blocks per day.",
                    val: 200000,
                    step: 1,
                    unit: "Blocks",
                    title: "Down Power Period"
                  },
                  {
                    id: "dex_fee",
                    range_low: 0,
                    range_high: 0.01,
                    info: "Share of DEX completed DEX trades to allocate over the collateral group.",
                    val: 0.00505,
                    step: 0.000001,
                    unit: "",
                    title: "DEX Fee"
                  },
                  {
                    id: "dex_max",
                    range_low: 28800,
                    range_high: 2592000,
                    info: "Largest open trade size in relation to held collateral.",
                    val: 97.38,
                    step: 1,
                    unit: "%",
                    title: "Max Trade Size"
                  },
                  {
                    id: "dex_slope",
                    range_low: 0,
                    range_high: 100,
                    info: "0 Allows any size buy orders to be placed. 1 will disallow large buy orders at low prices.",
                    val: 48.02,
                    step: 0.01,
                    unit: "%",
                    title: "Max Lowball Trade Size"
                  },
                  {
                    id: "spk_rate_ldel",
                    range_low: 0.00001, //current lpow
                    range_high: 0.0001, //current lgov
                    info: "SPK generation rate for delegated LARYNX Power",
                    val: 0.00015,
                    step: 1,
                    unit: "",
                    title: "SPK Gen Rate: Delegated"
                  },
                  {
                    id: "spk_rate_lgov",
                    range_low: 0.00015, //current ldel
                    range_high: 0.01,
                    info: "SPK generation rate for Larynx Locked",
                    val: 0.001,
                    step: 0.000001,
                    unit: "",
                    title: "SPK Gen Rate: Locked"
                  },
                  {
                    id: "spk_rate_lpow",
                    range_low: 0.000001,
                    range_high: 0.00015, //current ldel
                    info: "SPK generation rate for undelegated Larynx Power",
                    val: 0.0001,
                    step: 0.000001,
                    unit: "",
                    title: "Min SPK Gen Rate: Min"
                  },
                  {
                    id: "max_coll_members",
                    range_low: 25,
                    range_high: 79,
                    info: "The Max number of accounts that can share DEX fees. The richer half of this group controls outflows from the multisig wallet.",
                    val: 25,
                    step: 1,
                    unit: "Accounts",
                    title: "Size of collateral group"
                  }
                ]
              },
              contract: {
                api: '',
                id: '',
                files: '',
                fosig: '', //file-owner
                spsig: '', //service-provider 
                s: 10485760,
                t: 0
              }
        };
    },
    emits: ['tosign'],
    methods: {
        modalSelect(url) {
            this.$emit('modalselect', url);
        },
        exp_to_time(exp = '0:0') {
            return this.when([parseInt(exp.split(':')[0])])
        },
        replace(string, char = ':') {
        return string.replaceAll(char, '_')
        },
        slotDecode(slot, index) {
            var item = slot.split(',')
            switch (index) {
              case 1:
                return parseFloat(item[1] / 100).toFixed(2)
                break;
              default:
                return item[0]
                break;
            } index
        },
        getSapi(user = this.account) {
            fetch(this.sapi + "/@" + user)
              .then((response) => response.json())
              .then((data) => {
                data.tick = data.tick || 0.01;
                this.larynxbehind = data.behind;
                  this.lbalance = (data.balance / 1000).toFixed(3);
                  this.lbargov = (data.gov / 1000).toFixed(3);
                  data.powerDowns = Object.keys(data.power_downs);
                  for (var i = 0; i < data.powerDowns.length; i++) {
                    data.powerDowns[i] = data.powerDowns[i].split(":")[0];
                  }
                  for (var node in data.file_contracts) {
                    this.contractIDs[data.file_contracts[node].i] = data.file_contracts[node];
                    this.contracts.push(data.file_contracts[node]);
                    this.contractIDs[data.file_contracts[node].i].index = this.contracts.length - 1;
                  }
                  for (var user in data.channels) {
                    for (var node in data.channels[user]) {
                        if(this.contractIDs[data.channels[user][node].i])continue
                        else {
                            this.contractIDs[data.channels[user][node].i] = data.channels[user][node];
                            this.contracts.push(data.channels[user][node]);
                            this.contractIDs[data.channels[user][node].i].index = this.contracts.length - 1;
                        }
                    }
                  }
                  this.saccountapi = data;
                  this.saccountapi.spk += this.reward_spk();
                  if (!this.saccountapi.granted.t) this.saccountapi.granted.t = 0;
                  if (!this.saccountapi.granting.t) this.saccountapi.granting.t = 0;
                  this.spkval =
                    (data.balance +
                      data.gov +
                      data.poweredUp +
                      this.saccountapi.granting.t +
                      data.claim +
                      data.spk) /
                    1000;
              });
          },
        getSpkStats() {
            fetch(this.sapi + "/stats")
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                this.spkStats = data.result;
                for (var i = 0; i < this.tokenGov.options.length; i++) {
                  this.tokenGov.options[i].val = data.result[this.tokenGov.options[i].id]
                  this.tokenGov.options[i].range_high = parseFloat(this.tokenGov.options[i].val * 1.01).toFixed(6)
                  this.tokenGov.options[i].range_low = parseFloat(this.tokenGov.options[i].val * 0.99).toFixed(6)
                  this.tokenGov.options[i].step = "0.000001"
                }
                this.getSapi()
              });
        },
        when(arr) {
            if (!arr.length) return "";
            var seconds =
              (parseInt(arr[0]) - parseInt(this.saccountapi.head_block)) * 3;
            var interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
              return interval + ` day${interval > 1 ? "s" : ""}`;
            }
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
              return interval + ` hour${interval > 1 ? "s" : ""}`;
            }
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              return `${interval} minute${interval > 1 ? "s" : ""}`;
            }
            return Math.floor(seconds) + " seconds";
          },
        reward_spk() {
            var r = 0,
              a = 0,
              b = 0,
              c = 0,
              t = 0,
              diff = (this.saccountapi.head_block ? this.saccountapi.head_block : this.sstats.lastIBlock) - this.saccountapi.spk_block;
              console.log(diff, this.saccountapi.head_block , this.sstats)
              if (!this.saccountapi.spk_block) {
              console.log("No SPK seconds");
              return 0;
            } else if (diff < 28800) {
              console.log("Wait for SPK");
              return 0;
            } else {
              t = parseInt(diff / 28800);
              a = this.saccountapi.gov
                ? simpleInterest(this.saccountapi.gov, t, this.sstats.spk_rate_lgov)
                : 0;
              b = this.saccountapi.pow
                ? simpleInterest(this.saccountapi.pow, t, this.sstats.spk_rate_lpow)
                : 0;
              c = simpleInterest(
                parseInt(
                  this.saccountapi.granted?.t > 0 ? this.saccountapi.granted.t : 0
                ) +
                parseInt(
                  this.saccountapi.granting?.t > 0 ? this.saccountapi.granting.t : 0
                ),
                t,
                this.sstats.spk_rate_ldel
              );
              console.log({
                t,
                a,
                b,
                c,
                d: this.saccountapi.granted?.t > 0 ? this.saccountapi.granted.t : 0,
                g: this.saccountapi.granting?.t > 0 ? this.saccountapi.granting.t : 0,
              });
              const i = a + b + c;
              if (i) {
                console.log(i, "Phantom SPK");
                return i;
              } else {
                console.log("0 SPK");
                return 0;
              }
            }
            function simpleInterest(p, t, r) {
              console.log({ p, t, r });
              const amount = p * (1 + parseFloat(r) / 365);
              const interest = amount - p;
              return parseInt(interest * t);
            }
          },
        selectContract(id, broker) {  //needs PeerID of broker
            this.contract.id = id
            fetch(`${this.sapi}/user_services/${broker}`)
              .then(r => r.json())
              .then(res => {
                console.log(res)
                this.contract.api = res.services.IPFS[Object.keys(res.services.IPFS)[0]].a
              })
          },
        isStored(contract){
            var found = false
            for (var i in this.contracts[contract].n) {
                if (this.contracts[contract].n[i] == this.account) {
                    found = true
                    break
                }
            }
            return found
        },
        extend(contract, amount){
            if(amount > this.broca_calc(this.broca))return
            const toSign = {
                type: "cja",
                cj: {
                  broca: amount,
                  id: contract.i,
                  file_owner: contract.t,
                  power: this.spread ? 1 : 0,
                },
                id: `spkcc_extend`,
                msg: `Extending ${contract}...`,
                ops: ["getTokenUser"],
                api: "https://spktest.dlux.io",
                txid: "extend",
              }
              this.$emit('tosign', toSign)
        },
        store(contract, remove = false){
            // have a storage node?
            const toSign = {
                type: "cja",
                cj: {
                  items: [contract]
                },
                id: `spkcc_${!remove ? 'store' : 'remove'}`,
                msg: `Storing ${contract}...`,
                ops: ["getTokenUser"],
                api: "https://spktest.dlux.io",
                txid: `${contract}_${!remove ? 'store' : 'remove'}`,
              }
              this.$emit('tosign', toSign)
        },
        updateCost(id) {
            this.extendcost[id] = parseInt(this.contracts[id].extend * (this.contracts[id].p + (this.spread ? 1 : 0)) / (30 * 3) * this.contracts[id].r)
            this.$forceUpdate()
        },
        getContracts() {
            var contracts = [],
                getContract = (id) => {
                    fetch('https://spktest.dlux.io/api/fileContract/' + id)
                        .then((r) => r.json())
                        .then((res) => {
                            res.result.extend = "7"
                            if (res.result) {
                                this.contracts[id] = res.result
                                this.extendcost[id] = parseInt(res.result.extend / 30 * res.result.r)
                            }
                        });
                }
            for (var contract in this.post.contract) {
                contracts.push(contract)
            }
            contracts = [...new Set(contracts)]
            for (var i = 0; i < contracts.length; i++) {
                getContract(contracts[i])
            }
        },
        imgUrlAlt(event) {
            event.target.src = "/img/dlux-logo-icon.png";
        },
        picFind(json) {
            var arr;
            try {
                arr = json.image[0];
            } catch (e) { }
            if (typeof json.image == "string") {
                return json.image;
            } else if (typeof arr == "string") {
                return arr;
            } else if (typeof json.Hash360 == "string") {
                return `https://ipfs.io/ipfs/${json.Hash360}`;
            } else {
                /*
                        var looker
                        try {
                            looker = body.split('![')[1]
                            looker = looker.split('(')[1]
                            looker = looker.split(')')[0]
                        } catch (e) {
                            */
                return "/img/dluxdefault.svg";
            }
        },
        pending(event) {
            this.mde = event
        },
        vote(url) {
            this.$emit('vote', { url: `/@${this.post.author}/${this.post.permlink}`, slider: this.slider, flag: this.flag })
            console.log(this.post)
        },
        color_code(name) {
            return parseInt(this.contracts[name] ? this.contracts[name].e.split(':')[0] : 0) - this.head_block
        },
        timeSince(date) {
            var seconds = Math.floor((new Date() - new Date(date + ".000Z")) / 1000);
            var interval = Math.floor(seconds / 86400);
            if (interval > 7) {
                return new Date(date).toLocaleDateString();
            }
            if (interval >= 1) {
                return interval + ` day${interval > 1 ? "s" : ""} ago`;
            }
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                return interval + ` hour${interval > 1 ? "s" : ""} ago`;
            }
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                return `${interval} minute${interval > 1 ? "s" : ""} ago`;
            }
            return Math.floor(seconds) + " seconds ago";
        },
        setReply(event) {
            this.mde = event
        },
        reply(deets) {
            if (!deets) deets = {
                "parent_author": this.post.author,
                "parent_permlink": this.post.permlink,
                "author": this.account,
                "permlink": 're-' + this.post.permlink,
                "title": '',
                "body": this.mde,
                "json_metadata": JSON.stringify(this.postCustom_json)
            }
            this.$emit('reply', deets)
        },
        broca_calc(last = '0,0') {
            if(!last)last='0,0'
            const last_calc = this.Base64toNumber(last.split(',')[1])
            const accured = parseInt((parseFloat(this.broca_refill) * (this.head_block - last_calc)) / (this.spk_power * 1000))
            var total = parseInt(last.split(',')[0]) + accured
            if (total > (this.spk_power * 1000)) total = (this.spk_power * 1000)
            return total
        },
        Base64toNumber(chars) {
            const glyphs =
              "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+=";
            var result = 0;
            chars = chars.split("");
            for (var e = 0; e < chars.length; e++) {
              result = result * 64 + glyphs.indexOf(chars[e]);
            }
            return result;
        },
        formatNumber(t = 1, n, r, e) { // number, decimals, decimal separator, thousands separator
            if (typeof t != "number") {
                const parts = t ? t.split(" ") : []
                var maybe = 0
                for (i = 0; i < parts.length; i++) {
                    if (parseFloat(parts[i]) > 0) {
                        maybe += parseFloat(parts[i])
                    }
                }
                if (maybe > parseFloat(t)) {
                    t = maybe
                } else {
                    t = parseFloat(t)
                }
            }
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
        gt(a, b) {
            return parseFloat(a) > parseFloat(b);
        },
        precision(num, precision) {
            return parseFloat(num / Math.pow(10, precision)).toFixed(precision);
        },
        toFixed(n, digits) {
            return parseFloat(n).toFixed(digits)
        },
        hideLowRep() {
            if (this.post.rep != '...') {
                if (parseFloat(this.post.rep) < 25) {
                    this.view = false;
                    this.warn = true;
                }
            } else {
                setTimeout(this.hideLowRep, 1000)
            }
        },
        setRating(rating) {
            this.post.rating = rating;
        },
        fancyBytes(bytes){
            var counter = 0, p = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
            while (bytes > 1024){
              bytes = bytes / 1024
              counter ++
            }
            return `${this.toFixed(bytes, 2)} ${p[counter]}B`
        },
        expIn(con){
            return `Expires in ${parseInt((parseInt(con.e.split(':')[0]) - this.head_block) / 20 / 60) < 24 ? parseInt((parseInt(con.e.split(':')[0]) - this.head_block) / 20 / 60) + ' hours' : parseInt((parseInt(con.e.split(':')[0]) - this.head_block) / 20 / 60 / 24) + ' days'}`
        }
    },
    mounted() {
        this.getSpkStats()
    },
};

