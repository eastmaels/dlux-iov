import Tagify from "/js/tagifyvue.js";
import MDE from "/js/mde-min.js";
import Bennies from "/js/bennies-min.js";

export default {
    template: `
    <!-- post builder -->
    <div class="accordion-body">
    <form onsubmit="return false;">
        <div class="form-group mb-3">
            <label for="username">Author</label>
            <div class="input-group">
                <span
                    class="input-group-text">@</span>
                <input type="text"
                    class="form-control text-info"
                    readonly id="username" v-model="account">
            </div>
        </div>
        <div class="form-group mb-3">
            <label for="title">Title</label>
            <input type="text"
                class="form-control" id="title"
                placeholder="Enter an attention grabbing title" v-model="postTitle"
                @blur="permlink()">
            <small id="permlinkPreview" class="form-text text-muted d-flex"><span
                    id="permlink" class="mr-auto">Permlink:
                    https://dlux.io/{{postCustom_json.vrHash || postCustom_json.tags[0] || 'blog'}}/@{{account}}/{{postPermlink}}</span>
                <!-- <a href="#" class="ml-auto"> Edit Permlink</a> -->
            </small>
        </div>
        <div class="form-group mb-3">
            <label for="body">Post Body</label>
            <mde id="body" @data="postBody = $event" />
        </div>
        <div class="form-group mb-3">
            <label for="tags">Tags</label><br>
            <tagify class="rounded w-100"
                @data="postTags = $event" id="tags" />
        </div>
        <bennies :list="postBens" @updatebennies="postBens = $event" />
        <!--<ul v-if="postBens.length">
            <h6>Benificiaries: ({{postBens.length}}/8) </h6>

            <li v-for="ben in postBens">@{{ben.account}}: {{formatNumber(ben.weight/ 100,2, '.')}}% <button type="button" class="btn btn-outline-danger btn-sm"
                @click="delBen(ben.account)">Remove</button></li>
        </ul>
        <button class="btn btn-outline-primary" v-if="!isDlux" type="button"
            @click="addBen('dlux-io', 1000)">Include in
            DLUX Ecosystem</button>
        <button v-for="item in isntBenned" type="button"
            @click="addBen(item.account, item.weight)">Include Contract
            {{item.contract}}</button>-->
        <div class="text-center">
            <button ref="publishButton" type="button" @keyUp="buildTags()"
                class="btn btn-danger" data-toggle="tooltip" data-placement="top"
                title="Publish to HIVE" :disable="!validPost"
                @click="post()">Publish</button>
        </div>
    </form>
</div>
   `,
props: {
    account: {
        type: String,
        required: true,
        default: ""
    },
    prop_bens: {
        type: Array,
        required: false,
        default: function () {
            return []
        },
    },
    prop_links: {
      type: String,
      required: false,
      default: ""
    },
    prop_contracts:{
        type: Array,
        required: false,
        default: function () {
            return []
        },
    },
    parent_author: {
        type: String,
        required: false,
        default: ""
    },
    parent_permlink: {
        type: String,
        required: false,
        default: ""
    },
    prop_json: {
        type: Object,
        required: false,
        default: function () {
            return {}
        },
    }
},
data() {
    return {
        postBens: [],
        postTitle: "",
        postPermlink: "",
        postBody: "",
        postTags: "",
        postCustom_json: {
            "app": "dlux/0.1",
            "vrHash": "",
            "assets": [],
            tags: []
        }
    };
},
emits: ['tosign', 'passdata'],
methods: {
    buildTags() {
        this.postTags = this.postTags.replace(/#/g, "");
      },
      post() {
        for (var i = 0; i < this.postCustom_json.assets.length; i++) {
          delete this.postCustom_json.assets[i].config
          if (!this.postCustom_json.assets[i].f) delete this.postCustom_json.assets[i].f
        }
        if(this.postCustom_json.vrHash){
            this.postCustom_json.tags = ['dlux']
            for (var i = 0; i < this.postTags.length; i++) {
                if (this.postTags[i] != 'dlux') {
                    this.postCustom_json.tags.push(this.postTags[i]);
                }
            }
        } else {
            this.postCustom_json.tags = []
            for (var i = 0; i < this.postTags.length; i++) {
                this.postCustom_json.tags.push(this.postTags[i]);
            }
        }
        if(this.postCustom_json.tags.length == 0){
            this.postCustom_json.tags = ['blog']
        }
        if (this.account && this.postPermlink && this.postTitle && this.postBody) {
          const operations = [["comment",
            {
              "parent_author": this.parent_author,
              "parent_permlink": this.parent_permlink || this.postCustom_json.tags[0],
              "author": this.account,
              "permlink": this.postPermlink,
              "title": this.postTitle,
              "body": this.postBody + (this.postCustom_json.vrHash ? `\n***\n#### [View in VR @ dlux.io](https://dlux.io/dlux/@${this.account}/${this.postPermlink})\n` : ""),
              "json_metadata": JSON.stringify(this.postCustom_json)
            }]]
          if (this.postBens.length > 0) {
            operations.push(["comment_options",
            {
              "author": this.account,
              "permlink": this.postPermlink,
              "max_accepted_payout": "1000000.000 HBD",
              "percent_hbd": 10000,
              "allow_votes": true,
              "allow_curation_rewards": true,
              "extensions":
                [[0,
                  {
                    "beneficiaries":
                      this.postBens
                  }]]
            }])
          }
          const toSign = {
            type: "raw",
            op: operations,
            key: `posting`,
            msg: `Posting...`,
            ops: ["checkAccount"],
            txid: `Posting @${this.account}/${this.postPermlink}`,
          }
          this.$emit('tosign', toSign)
        }
      },
      formatNumber(t, n, r, e) { // number, decimals, decimal separator, thousands separator
        if (typeof t != "number") {
          const parts = t ? t.split(" ") : []
          var maybe = 0
          for (i = 0; i < parts.length; i++) {
            if (parseFloat(parts[i])>0){
              maybe += parseFloat(parts[i])
            }
          }
          if (maybe>parseFloat(t)){
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
          for (var c = /(\d+)(\d{3})/; c.test(i); )
            i = i.replace(c, "$1" + e + "$2");
        return (u ? "-" : "") + i + o;
      },
    addBen(acc, weight) {
        if(this.postBens.length >= 8){
            alert('You can only have 8 benificiaries')
            return
        }
        weight = parseInt(weight)
        var found = -1
        var total = 0
        if (!acc) return false
        for (var i = 0; i < this.postBens.length; i++) {
          if (this.postBens[i].account == acc) {
            found = i
          } else {
            total += this.postBens[i].weight
          }
        }
        if (total + weight > 10000) return
        if (found >= 0) {
          this.postBens[found].weight = weight
        } else {
          // sort by account 
          for (var i = 0; i < this.postBens.length; i++) {
            if (this.postBens[i].account > acc) {
              this.postBens.splice(i, 0, {
                account: acc,
                weight: weight
              })
              return
            }
          }
          this.postBens.push({
            account: acc,
            weight: weight
          })
        }
      },
      delBen(acc) {
        var found = -1
        if (!acc) return false
        for (var i = 0; i < this.postBens.length; i++) {
          if (this.postBens[i].account == acc) {
            found = i
          }
        }
        if (found >= 0) {
          this.postBens.splice(found, 1)
        }
      },
      permlink(text) {
        if (text) {
          text.replace(/[\W_]+/g, '-').replace(' ', '-').toLowerCase()
          text = text.replace(' ', '-')
          text = text.replace(/[\W_]+/g, '')
          text = text.toLowerCase()
          this.postPermlink = text
        } else {
          text = this.postTitle
          text = text.replace(' ', '-')
          text = text.replace(/[\W_]+/g, '-')
          text = text.toLowerCase()
          this.postPermlink = text;
        }
      },
},
computed: {
    validPost() {
        if(!this.postPermlink)return false
        if(!this.postTitle)return false
        if(!this.postBody)return false
        else return true
    },
    isDlux() {
        var found = false
        for (var i = 0; i < this.postBens.length; i++) {
            if (this.postBens[i].account == 'dlux-io') {
                found = true
                break
            }
        }
        return found
    },
    isntBenned() {
        var isnt = []
        for (var i = 0; i < this.prop_contracts.length; i++) {
            var found = false
            for (var j = 0; j < this.postBens.length; j++) {
                if (this.prop_contracts[i].c != 2 || this.postBens[j].account == this.prop_contracts[i].s.split(',')[0]) {
                    found = true
                }
            }
            if (!found && this.prop_contracts[i].t == this.account) {
                isnt.push({account:this.prop_contracts[i].s.split(',')[0],weight:this.prop_contracts[i].s.split(',')[1],contract:this.prop_contracts[i].i})
            }
        }
        return isnt
    
    }
},
components: {
    "tagify": Tagify,
    "mde": MDE,
    "bennies": Bennies
},
watch: {
    'prop_bens': {
            handler: function () {
                console.log('caught!');
                for(var i = 0; i < this.prop_bens.length; i++){
                    if(typeof this.prop_bens[i] == "string")this.addBen(this.prop_bens[i].split(',')[0], this.prop_bens[i].split(',')[1])
                    else this.addBen(this.prop_bens[i].account, this.prop_bens[i].weight)
                }
            },
            deep: true
    },
    'prop_contracts'(newValue){
        if(newValue.length){
            for(var i = 0; i < this.prop_contracts.length; i++){
                this.addBen(this.prop_contracts[i].s.split(',')[0], this.prop_contracts[i].s.split(',')[1])
            }
        }
    },
    'prop_json'(newValue){
        if(newValue){
            for(var node in this.prop_json){
                this.postCustom_json[node] = this.prop_json[node]
            }
        }
    }
},
mounted() {
    for(var i = 0; i < this.prop_bens.length; i++){
        if(typeof this.prop_bens[i] == "string")this.addBen(this.prop_bens[i].split(',')[0], this.prop_bens[i].split(',')[1])
        else this.addBen(this.prop_bens[i].account, this.prop_bens[i].weight)
    }
    for(var node in this.prop_json){
        this.postCustom_json[node] = this.prop_json[node]
    }
    for(var i = 0; i < this.prop_contracts.length; i++){
        this.addBen(this.prop_contracts[i].s.split(',')[0], this.prop_contracts[i].s.split(',')[1])
        this.postCustom_json = this.prop_json[node]
    }
    this.postBody = this.prop_links
},
};