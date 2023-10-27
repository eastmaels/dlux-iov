import Marker from "/js/marker.js";
import Ratings from "/js/ratings.js";
import MDE from "/js/mde.js";
import Vote from "/js/vote.js";
import Pop from "/js/pop.js";

export default {
    components: {
        "vue-markdown": Marker,
        "vue-ratings": Ratings,
        "mde": MDE,
        "vote": Vote,
        "pop-vue": Pop
    },
    template: `
    <div :id="'contract-' +  post.author + '-' + post.permlink">
        <form v-for="(cid, name, index) in post.contract" id="contractForm">
            <div v-if="contracts[name]">

            <!-- detail banner -->
            <div class="d-flex flex-column mb-2">
                <div class="w-100 py-1 bg-dark">
                    <div class="d-flex justify-content-between align-items-center mx-2">
                        <span class="text-break">{{fancyBytes(contracts[name].u)}} | {{expIn(contracts[name])}}</span>
                        <button type="button" class="btn btn-sm btn-outline-success" data-bs-toggle="collapse" :data-bs-target="'#nodes-' + post.permlink">
                        <i class="fa-solid fa-tower-broadcast fa-fw me-1"></i>{{contracts[name].nt}}/{{contracts[name].p}}</button>
                    </div>
                    <div class="collapse mx-2" :id="'nodes-' + post.permlink">
                        <div class="text-lead text-uppercase text-white-50 pb-05 mt-1 border-bottom">Nodes Storing This Contract</div>
                        <ol type="1" class="my-1">
                            <div v-for="(acc, prop, index) in contracts[name].n" >
                                <li><a :href="'/@' + acc " class="no-decoration text-info">@{{acc}}</a></li>
                                <div v-if="index == Object.keys(contracts[name].n).length - 1 && index + 1 < contracts[name].p" v-for="i in (contracts[name].p - (index + 1))">
                                    <li>Open</li>
                                </div>
                            </div>
                        </ol>
                        <p class="d-none" v-if="index == Object.keys(contracts[name].n).length - 1 && index + 1 < contracts[name].p">{{contracts[name].p - (index + 1) }} slots are open!</p>
                    </div>
                </div>
            </div>

            <!-- node banner -->
            <div v-if="has_ipfs" class="alert alert-secondary d-flex align-items-center py-1 ps-2 pe-1 mx-2 mb-2">
                <div class="me-1">{{isStored(contracts[name].i) ? 'Your node is storing this contract' : 'Your node is not storing this contract'}}</div>
                <div class="ms-auto d-flex flex-wrap align-items-center justify-content-center mb-1">
                
                <button style="max-width:100px;"
                        @click="store(contracts[name].i, isStored(contracts[name].i))" class="flex-grow-1 ms-1 mt-1 btn btn-sm text-nowrap"
                    :class="{'btn-success': !isStored(contracts[name].i), 'btn-danger': isStored(contracts[name].i)}">
                    <span v-if="!isStored(contracts[name].i)"><i class="fa-solid fa-square-plus fa-fw me-1"></i>Add</span>
                    <span v-if="isStored(contracts[name].i)"><i class="fa-solid fa-trash-can fa-fw me-1"></i>Remove</span>
                </button>
                <button style="max-width:100px;" type="button" class="flex-grow-1 btn btn-sm btn-warning ms-1 mt-1" @click="">
                    <i class="fa-solid fa-flag fa-fw me-1"></i>Flag</button>
                </div>
            </div>

            

            <!-- extend time input -->
            <div class="d-flex flex-wrap px-2 mb-2">
                <div class="btn-group mt-1">
                    <input name="time" @change="updateCost(name);customTime = false" title="1 Day" class="btn-check" :id="'option1-' + name" type="radio"
                        value="1" v-model="contracts[name].extend" checked>
                    <label class="btn btn-sm btn-outline-info" :for="'option1-' + name">1D</label>
                    <input name="time" @change="updateCost(name);customTime = false" title="1 Week" class="btn-check" :id="'option2-' + name"
                        type="radio" value="7" v-model="contracts[name].extend">
                    <label class="btn btn-sm btn-outline-info" :for="'option2-' + name">1W</label>
                    <input name="time" @change="updateCost(name);customTime = false" title="1 Month" class="btn-check" :id="'option3-' + name"
                        type="radio" value="30" v-model="contracts[name].extend">
                    <label class="btn btn-sm btn-outline-info" :for="'option3-' + name">1M</label>
                    <input name="time" @change="updateCost(name);customTime = false" title="1 Year" class="btn-check" :id="'option4-' + name"
                        type="radio" value="365" v-model="contracts[name].extend">
                    <label class="btn btn-sm btn-outline-info" :for="'option4-' + name">1Y</label>
                </div>
                <div class="input-group flex-nowrap col ms-1 mt-1">
                    <input type="number" step="1" class="form-control px-1 btn-sm text-end border-info text-info"
                        v-model="contracts[name].extend" @change="updateCost(name)" style="min-width: 60px;">
                    <span class="input-group-text btn-sm">Days</span>
                </div>
            </div>

            <!-- action buttons -->
            <div class="px-2 mb-2 d-flex flex-wrap text-wrap align-items-center text-white-50">
                <button type="button" class="btn btn-sm btn-primary mt-1" :disabled="extendcost[name] > broca_calc(broca)" @click="extend(contracts[name], extendcost[name])">
                    <i class="fa-solid fa-clock-rotate-left fa-fw me-1"></i>Extend</button>
                <button type="button" class="btn btn-sm btn-warning ms-1 mt-1" v-if="contracts[name].t == account" @click="cancel_contract(contracts[name])">
                    <i class="fa-solid fa-file-circle-xmark fa-fw me-1"></i>Sever</button>
                <button type="button" class="btn btn-sm btn-secondary ms-1 mt-1" data-bs-toggle="collapse"
                :data-bs-target="'#contract-' + post.author + '-' + post.permlink">
                    <i class="fa-solid fa-xmark fa-fw"></i></button>
                <div class="d-flex align-items-center text-wrap ms-1 mt-1 btn btn-sm btn-outline-secondary p-0">
                    <label :for="'spread-' + name" role="button" class="ps-1">&nbsp;</label>
                    <input class="form control" :id="'spread-' + name" type="checkbox" role="button" v-model="spread" @change="updateCost(name)">
                    <label :for="'spread-' + name" role="button" class="px-1 py-05">Add<i class="fa-solid fa-tower-broadcast fa-fw ms-1"></i></label>
                </div>
                <div class="ms-auto mt-1 text-primary fw-bold">{{formatNumber(extendcost[name], 0, '.',',')}}
                Broca</div>
            </div>

            </div>
        </form>
    </div>
`,
    props: {
        head_block: {
            default: 0
        },
        TOKEN: {
            default: 'DLUX'
        },
        post: {
            required: true,
            default: function () {
                return {

                };
            },
        },
        account: {
            default: ''
        },
        has_ipfs: {
            default: false
        },
        voteval: 0,
        post_select: {
            default: function () {
                return {}
            }
        },
        contracts: {
            default: function () {
                return {}
            }
        },
        extendcost: {
            default: function () {
                return {}
            }
        },
        broca_refill:{
            default: 0
        },
        broca: {
            default: 0
        },
        spk_power: {
            default: 0
        }
    },
    data() {
        return {
            collapse: false,
            edit: false,
            view: true,
            mde: '',
            makeReply: false,
            warn: false,
            flag: false,
            slider: 10000,
            spread: false,
            showNodes: false,
            bens: [],
        };
    },
    emits: ['vote', 'reply', 'modalselect', 'tosign'],
    methods: {
        modalSelect(url) {
            this.$emit('modalselect', url);
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
        this.hideLowRep()
        this.getContracts()
    },
};
