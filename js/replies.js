import Marker from "/js/marker.js";
import Ratings from "/js/ratings.js";
import MDE from "/js/mde.js";
import Vote from "/js/vote.js";
import Pop from "/js/pop.js";

export default {
    name: "replies",
    components: {
        "vue-markdown": Marker,
        "vue-ratings": Ratings,
        "mde": MDE,
        "vote": Vote,
        "pop-vue": Pop,
      },
  template: `
<div>
  <a role="button" v-if="warn" @click="warn = false">Hidden due to low reputation.</a>
  <div class="card bg-img-none text-white m-2">
    <div class="card-header">
      <div class="d-flex align-items-center">
        <a :href="'/@' + post.author" class="no-decoration">
          <div class="d-flex align-items-center">
            <img :src="'https://images.hive.blog/u/' + post.author + '/avatar'"
                    class="rounded-circle bg-light img-fluid me-1 cover author-img" style="width: 50px;">
              <div>
                <div class="d-flex align-items-center">
                  <h5 class="m-0 text-white-50">{{ post.author }}</h5>
                  <span class="ms-1 badge small text-bg-light">{{ post.rep }}</span>
                </div>
                <span class="small text-muted" style="font-weight: 400">{{ timeSince(post.created) }}</span>
              </div>
          </div>
        </a>
        <a role="button" class="ms-auto no-decoration text-white" @click="view = !view"><i v-show="view" class="fa-solid fa-circle-minus fa-fw"></i><i v-show="!view" class="fa-solid fa-circle-plus fa-fw"></i>({{post.children + 1}})</a>                    
      </div> 
      </div>
      <div class="card-body" v-if="view" v-show="!edit">
           <vue-markdown :md="post.body"/>
        </div>
        <div v-show="edit">
           <vue-markdown :toedit="post.body" @settext="pending($event)"/>
        </div>
        
        <div class="card-footer">
          <vote :post="post" :account="account" :voteval="voteval" @vote="vote($event)" @reply="reply($event)"></vote>
        </div>
        <div v-for="reps in post.replies">
            <replies v-if="view" :post="reps" :account="account" :voteval="voteval" @vote="vote($event)" @reply="reply($event)"/>
        </div>
     </div>
  </div>
        `,
    props: {
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
        voteval: 0,
    },
    data() {
    return {
        collapse: false,
        edit: false,
        view: true,
        mde: '',
        makeReply: false,
        warn: false,
    };
    },
    emits: ['vote', 'reply'],
    methods:{
        pending(event){
            this.mde = event
        },
        vote(event){
            this.$emit('vote', event);
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
        setReply(event){
            this.mde = event
        },
        reply(deets){
            if(!deets)deets = {
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
          gt(a,b){
          return parseFloat(a)>parseFloat(b);
        },
        hideLowRep(){
            if(this.post.rep != '...'){
                if(parseFloat(this.post.rep) < 25){
                    this.view = false;
                    this.warn = true;
                }
            } else {
                setTimeout(this.hideLowRep, 1000)
            }
        },
        setRating(rating){
            this.post.rating = rating;
          }
    },
  mounted() {
    this.hideLowRep()
  },
};

